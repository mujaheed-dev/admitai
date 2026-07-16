// @ts-nocheck
// Runs in Supabase's Deno runtime. @ts-nocheck suppresses false IDE errors
// for Deno globals (Deno.serve, Deno.env) — these are valid at runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { reportError } from '../_shared/sentry.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { buildAdmitaiContext, detectCoverageCountries } from '../_shared/admitai-data.ts'
import { getActiveSubscription, checkFairUse, bumpFairUse, FAIR_USE_MONTHLY_CAP } from '../_shared/subscription.ts'

// ─── constants ────────────────────────────────────────────────────────────────

const FREE_LIMIT = 2  // number of free AI searches per user

// ─── types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── system prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are AdmitAI, a warm, honest, and encouraging university admissions guide.
You help international students — many of whom are applying alone, on tight budgets, with no adviser —
to understand their options, find affordable universities, discover scholarships, and navigate the
application process for undergraduate, master's, and PhD programmes.

━━━ PART A — USING ADMITAI'S VERIFIED DATA ━━━

You have been given AdmitAI's own verified reference dataset (countries, scholarships, universities)
at the bottom of this system prompt. Follow these rules strictly:

RULE 1 — DATA-FIRST:
When a student asks about a country, scholarship, or university that appears in the AdmitAI Verified
Data below, answer primarily from that data. Introduce it naturally, e.g. "According to AdmitAI's
verified data..." or "Our verified figures show..." or just state the fact and note it's from our data.
Entries marked [VERIFIED] come from official government or university sources. Use them with confidence
(while still noting costs change year to year). Entries marked [ESTIMATE] are illustrative — be clear
they are not yet confirmed.

RULE 2 — HONESTY ABOUT GAPS:
The data below is an EXTRACT selected as relevant to this conversation; a COVERAGE INDEX at the end
lists what else AdmitAI holds. If asked about something in the coverage index but not in this extract,
say AdmitAI has verified data on it and invite the student to name the country/university directly so
you can pull the details next turn. If asked about something NOT in the extract OR the index, say:
"I don't have AdmitAI-verified data on [X] yet — here's what I know from general knowledge, but please
confirm with the official source."
Either way, NEVER invent or state specific tuition figures, scholarship amounts, acceptance rates, or
deadlines that are not written in the extract below. Say "typically" or "generally" and steer the
student to the official source.

RULE 3 — ACCURACY OVER COMPLETENESS:
Always note that even verified figures can change year to year, and the student should confirm before
applying. Saying "our data shows X but check the official source to confirm it's still current" is
the right framing.

RULE 4 — SURFACE RELEVANT DATA PROACTIVELY:
If a student mentions a budget or country that matches something in our data, mention the relevant
entries even if they didn't ask specifically. Example: if someone says "I'm looking to study in Germany",
proactively mention TUM, the DAAD scholarship, and the Deutschlandstipendium waiver from our verified data.

━━━ PART B — TONE, STYLE, AND HARD GUARDRAILS ━━━

TONE AND STYLE:
Write like a calm, knowledgeable friend talking directly to a nervous student — not like a formatted
report. Responses should feel human and easy to read on a phone.
- Short paragraphs (2-4 sentences). Leave breathing room between ideas.
- Use **bold** sparingly — only for 1 or 2 genuinely critical terms per response.
- Use bullet points only when listing 3 or more distinct items where a list genuinely helps.
  Do NOT default to bullet lists for every response. A sentence often reads better.
- Never use markdown headers (## or ###) in replies.
- Lead with a human sentence, not a list.

HARD GUARDRAILS (never break these):
- NEVER promise or imply guaranteed admission outcomes.
- NEVER write application essays from scratch. You can discuss what makes a strong essay, give
  feedback on a draft the student shares, or help structure ideas — but never produce a complete essay.
- ALWAYS admit when unsure. "I don't have reliable data on that" is far better than guessing.
- When discussing costs, always note they change yearly and the student must verify before applying.`

// ─── handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    // ── 1. Authenticate the user ────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    // Create a Supabase admin client using the automatically-injected service
    // role key. We use this to (a) verify the user's JWT and (b) read/write the
    // ai_usage table server-side — the service role bypasses RLS, which is safe
    // here because the edge function itself is trusted backend code that has
    // already validated the JWT.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // ── 2. Check usage limit (server-side — cannot be bypassed from browser) ─
    // Paid subscribers skip the free counter entirely; they get unlimited use
    // within the monthly fair-use cap. Free users keep their FREE_LIMIT.
    const sub = await getActiveSubscription(supabase, user.id)
    let fair = null
    let searchesUsed = 0

    if (sub) {
      fair = await checkFairUse(supabase, user.id)
      if (!fair.allowed) {
        // Fair-use cap hit — not an upgrade prompt, just a monthly ceiling.
        return json({
          limitReached: true,
          fairUse: true,
          searchesUsed: fair.used,
          searchesLimit: FAIR_USE_MONTHLY_CAP,
        })
      }
    } else {
      const { data: usageRow } = await supabase
        .from('ai_usage')
        .select('searches_used')
        .eq('user_id', user.id)
        .maybeSingle()

      searchesUsed = usageRow?.searches_used ?? 0

      if (searchesUsed >= FREE_LIMIT) {
        // Do NOT call Claude. Return a limit-reached signal.
        return json({
          limitReached: true,
          searchesUsed,
          searchesLimit: FREE_LIMIT,
        })
      }
    }

    // ── 3. Parse request and validate ───────────────────────────────────────
    const { message, history = [] }: { message: string; history: Message[] } = await req.json()

    if (!message?.trim()) {
      return json({ error: 'Message is required' }, 400)
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY secret is not set')
      return json({ reply: "I'm not configured yet — the API key is missing. Please contact support." })
    }

    // ── 4. Call Claude ───────────────────────────────────────────────────────
    const trimmedHistory = history.slice(-10)
    const messages: Message[] = [
      ...trimmedHistory,
      { role: 'user', content: message.trim() },
    ]

    // Retrieval: select only the verified-data entries relevant to what the
    // student has been talking about (current message + recent user turns),
    // instead of injecting the whole ~50k-token dataset on every request.
    const retrievalQuery = trimmedHistory
      .filter((m) => m.role === 'user')
      .slice(-3)
      .map((m) => m.content)
      .concat(message.trim())
      .join('\n')
    const system =
      SYSTEM_PROMPT + '\n\n━━━ ADMITAI VERIFIED REFERENCE DATA (RELEVANT EXTRACT) ━━━\n' +
      buildAdmitaiContext(retrievalQuery)

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system,
        messages,
      }),
    })

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}))
      console.error('Anthropic API error:', anthropicRes.status, errBody)
      return json({ reply: "I'm having trouble reaching my AI brain right now. Please try again in a moment." })
    }

    const anthropicData = await anthropicRes.json()
    const reply = anthropicData.content?.[0]?.text ?? "I couldn't generate a response. Please try again."

    // ── 4b. Coverage log (fire-and-forget — never blocks the reply) ─────────
    // Records what the student asked and which covered countries matched.
    // Empty matched_countries = a coverage gap: the demand signal for what
    // universities/scholarships to add next.
    supabase
      .from('ai_search_log')
      .insert({
        user_id: user.id,
        message: message.trim().slice(0, 500),
        matched_countries: detectCoverageCountries(message.trim()),
      })
      .then(({ error }) => {
        if (error) console.error('ai_search_log insert failed:', error.message)
      })

    // ── 5. Increment usage count (only after a successful Claude call) ───────
    if (sub) {
      await bumpFairUse(supabase, user.id, fair)
      // unlimited: true tells the frontend to hide the free-uses counter
      return json({ reply, limitReached: false, unlimited: true })
    }

    const newCount = searchesUsed + 1
    await supabase
      .from('ai_usage')
      .upsert(
        {
          user_id: user.id,
          searches_used: newCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )

    return json({
      reply,
      limitReached: false,
      searchesUsed: newCount,
      searchesLimit: FREE_LIMIT,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    await reportError(err, { fn: 'ask-admitai' })
    return json({ reply: "Something went wrong on my end. Please try again in a moment." })
  }
})
