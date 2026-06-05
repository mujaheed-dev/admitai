// @ts-nocheck
// Runs in Supabase's Deno runtime. @ts-nocheck suppresses false IDE errors
// for Deno globals (Deno.serve, Deno.env) — these are valid at runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { ADMITAI_VERIFIED_DATA } from '../_shared/admitai-data.ts'

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
If asked about a country, scholarship, or university that is NOT in the AdmitAI Verified Data below,
say something like: "I don't have AdmitAI-verified data on [X] yet — here's what I know from general
knowledge, but please confirm with the official source."
Then give helpful general guidance — but NEVER invent or state specific tuition figures, scholarship
amounts, acceptance rates, or deadlines for entries not in our data. Say "typically" or "generally"
and steer the student to the official source.

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
- When discussing costs, always note they change yearly and the student must verify before applying.

━━━ ADMITAI VERIFIED REFERENCE DATA ━━━
${ADMITAI_VERIFIED_DATA}`

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
    const { data: usageRow } = await supabase
      .from('ai_usage')
      .select('searches_used')
      .eq('user_id', user.id)
      .maybeSingle()

    const searchesUsed = usageRow?.searches_used ?? 0

    if (searchesUsed >= FREE_LIMIT) {
      // Do NOT call Claude. Return a limit-reached signal.
      return json({
        limitReached: true,
        searchesUsed,
        searchesLimit: FREE_LIMIT,
      })
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
        system: SYSTEM_PROMPT,
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

    // ── 5. Increment usage count (only after a successful Claude call) ───────
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
    return json({ reply: "Something went wrong on my end. Please try again in a moment." })
  }
})
