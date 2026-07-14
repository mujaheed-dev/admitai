// @ts-nocheck
// Runs in Supabase's Deno runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { buildAdmitaiContext } from '../_shared/admitai-data.ts'
import { getActiveSubscription, checkFairUse, bumpFairUse, FAIR_USE_MONTHLY_CAP } from '../_shared/subscription.ts'

const FREE_LIMIT = 2  // shared with ask-admitai — same ai_usage counter

// ─── system prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are AdmitAI, a warm, knowledgeable, and encouraging university admissions counsellor. You are generating a personalised study-abroad roadmap for a student.

━━━ CRITICAL HONESTY RULES ━━━

1. VERIFIED DATA FIRST: You have AdmitAI's verified reference data at the bottom of this prompt. When the student's target country appears in that data, USE IT and clearly label it as verified (e.g. "AdmitAI verified data shows…" or "[VERIFIED]").

2. HONEST ABOUT GAPS: The data below is an extract for the student's target country; a coverage index lists the other countries AdmitAI holds. For any country, university, or specific detail NOT in the verified data, give helpful general guidance but make it CLEARLY obvious this is general information — not AdmitAI-verified. Example: "We don't have verified data for Brazil yet — here's general guidance, but please confirm everything with official sources before acting on it."

3. NEVER INVENT: Do NOT state specific tuition figures, exact application deadlines, specific scholarship amounts, or acceptance rates for anything not in the verified data. Use "typically", "generally", "varies widely" and direct the student to official sources.

4. NO GUARANTEES: Never promise or imply guaranteed admission. Be encouraging but realistic.

5. TONE: Warm, specific, practical. Write for a student who may be the first in their family to study abroad — excited but nervous. Make the plan feel achievable. Use plain language, short paragraphs.

━━━ REQUIRED OUTPUT FORMAT ━━━

Respond with EXACTLY these seven section headers (## markdown, exactly as written). Do not skip or add sections.

## Your path at a glance
2–3 warm sentences summarising what studying this field at this level in this country typically looks like. Note if it's a well-trodden path for international students or a less common destination. End encouragingly.

## Language requirements
Language tests typically required (IELTS, TOEFL, DELF, TestDaF, etc.), score ranges, and language of instruction. Use verified data if available; otherwise give general picture and direct student to official university websites.

## Recommended universities
If verified data covers this country: highlight specific institutions with key facts (fees, strong fields, entry requirements). If not: describe what kinds of institutions to research and give 2–3 specific official sources to start their search (rankings, ministry of education sites, etc.). Never invent university names or statistics not in our data.

## Application timeline
A practical month-by-month plan working BACKWARD from a typical application deadline for this country/level. Use format "12+ months before:", "9 months before:", etc. 6–8 milestones. One line each. Keep it actionable.

## Visa steps
General student visa process for this country: key steps, typical documents, estimated processing time, and the official source to start with. Note clearly that requirements change — student must verify with the official embassy/government site.

## Scholarship opportunities
If verified data includes scholarships for this country: list them with key details (amount, eligibility, deadline, how to apply). If not: describe 3–4 types of funding commonly available (government, university merit, bilateral, external) and name the best search resources.

## Your first 3 steps
Three specific, concrete, achievable actions the student can take within the next 2 weeks. Start each with a strong verb (Research, Register, Contact, Book, Download, etc.). Make them specific — not generic advice.`

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
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // ── 2. Check shared usage limit ──────────────────────────────────────────
    // Paid subscribers skip the free counter; they get unlimited use within
    // the monthly fair-use cap (shared with ask-admitai and the paid tools).
    const sub = await getActiveSubscription(supabase, user.id)
    let fair = null
    let searchesUsed = 0

    if (sub) {
      fair = await checkFairUse(supabase, user.id)
      if (!fair.allowed) {
        return json({ limitReached: true, fairUse: true, searchesUsed: fair.used, searchesLimit: FAIR_USE_MONTHLY_CAP })
      }
    } else {
      const { data: usageRow } = await supabase
        .from('ai_usage')
        .select('searches_used')
        .eq('user_id', user.id)
        .maybeSingle()

      searchesUsed = usageRow?.searches_used ?? 0

      if (searchesUsed >= FREE_LIMIT) {
        return json({ limitReached: true, searchesUsed, searchesLimit: FREE_LIMIT })
      }
    }

    // ── 3. Parse and validate ────────────────────────────────────────────────
    const { field, country, level } = await req.json()

    if (!field?.trim() || !country?.trim() || !level?.trim()) {
      return json({ error: 'Field, country, and level are required.' }, 400)
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set')
      return json({ reply: "The AI isn't configured yet — please contact support." })
    }

    // ── 4. Build user message + relevant data extract ───────────────────────
    const userMessage =
      `Generate a personalised study-abroad roadmap for a student with the following details:\n` +
      `- Field of study: ${field.trim()}\n` +
      `- Target country: ${country.trim()}\n` +
      `- Study level: ${level.trim()}`

    // Retrieval: inject only the target country's verified data (plus the
    // coverage index) rather than the whole ~50k-token dataset.
    const system =
      SYSTEM_PROMPT + '\n\n━━━ ADMITAI VERIFIED REFERENCE DATA (RELEVANT EXTRACT) ━━━\n' +
      buildAdmitaiContext(`${country.trim()} ${field.trim()} ${level.trim()}`)

    // ── 5. Call Claude Haiku ─────────────────────────────────────────────────
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}))
      console.error('Anthropic error:', anthropicRes.status, errBody)
      return json({ reply: "I'm having trouble reaching the AI right now. Please try again in a moment." })
    }

    const anthropicData = await anthropicRes.json()
    const reply = anthropicData.content?.[0]?.text ?? "I couldn't generate a roadmap. Please try again."

    // ── 6. Increment usage ───────────────────────────────────────────────────
    if (sub) {
      await bumpFairUse(supabase, user.id, fair)
      return json({ reply, limitReached: false, unlimited: true })
    }

    const newCount = searchesUsed + 1
    await supabase
      .from('ai_usage')
      .upsert(
        { user_id: user.id, searches_used: newCount, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )

    return json({ reply, limitReached: false, searchesUsed: newCount, searchesLimit: FREE_LIMIT })
  } catch (err) {
    console.error('generate-roadmap error:', err)
    return json({ reply: "Something went wrong on my end. Please try again in a moment." })
  }
})
