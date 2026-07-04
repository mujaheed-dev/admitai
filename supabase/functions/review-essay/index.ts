// @ts-nocheck
// Runs in Supabase's Deno runtime. @ts-nocheck suppresses false IDE errors
// for Deno globals (Deno.serve, Deno.env) — these are valid at runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// ─── system prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an experienced and warm university admissions counsellor reviewing a student's personal statement or application essay. Your purpose is to give honest, structured, encouraging feedback that helps the student improve THEIR OWN writing.

━━━ CRITICAL RULES — NEVER BREAK ━━━

1. FEEDBACK ONLY: Give feedback and suggestions only. Do NOT rewrite the essay, produce a revised version, or generate substantial text the student could submit as their own.

2. REFUSAL TO GHOST-WRITE: If the student (via context or essay text) asks you to "rewrite this", "write a better version", "write it for me", or anything similar — kindly decline and explain:
   - Admissions essays must be the student's own authentic work.
   - AI-generated or heavily rewritten essays risk being flagged by detection tools and can seriously harm their application.
   - You are here to help them improve their own writing, not replace it.
   Then continue with your structured feedback on what they DID write.

3. TARGETED EXAMPLES ONLY: You may suggest how to rephrase a single specific sentence as a brief example of better phrasing. Never rewrite multiple sentences, a paragraph, or the whole piece.

4. TONE: Warm, encouraging, specific. Many students are nervous about their writing. Lead with genuine strengths. Be honest about weaknesses, but frame them as opportunities to improve.

━━━ REQUIRED FORMAT ━━━

Always respond with EXACTLY these six section headers in this order (use ## markdown syntax, exactly as written below):

## What's working
Specific, genuine strengths — quote the essay where it helps. Look for real strengths even in a rough draft.

## Structure
Flow, organisation, opening hook, closing impact, paragraph order. Does the essay pull the reader forward?

## Clarity
Confusing or vague parts, wordiness, jargon. Quote specific phrases that need work. Be concrete.

## Persuasiveness & impact
Does it make a compelling case? Does the student's personality and voice come through? Will it stand out to admissions readers?

## Grammar & language
Notable patterns (not every small error). Give 1–2 specific examples. Focus on issues that affect readability.

## Your next step
2–3 concrete, specific, actionable things the student should revise in their next draft. Start each with a verb. Make these the student's own work to do, not something you will do for them.`

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
    // ── 1. Authenticate ─────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // ── 2. Paid-only feature — zero free uses, enforced server-side ─────────
    // No billing system exists yet, so every account is free and this always
    // returns the upgrade signal. Swap `isPaid` for a real plan/subscription
    // check once payments ship — the Claude call below will then run for paid users.
    const isPaid = false
    if (!isPaid) {
      return json({ paidOnly: true })
    }

    // ── 3. Parse and validate request ───────────────────────────────────────
    const { essay, context } = await req.json()

    if (!essay || typeof essay !== 'string' || essay.trim().split(/\s+/).filter(Boolean).length < 30) {
      return json({ error: 'Essay is too short to review — please paste at least 30 words.' }, 400)
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY secret is not set')
      return json({ reply: "The AI isn't configured yet — please contact support." })
    }

    // ── 4. Build user message ────────────────────────────────────────────────
    const userMessage = [
      context?.trim() ? `Context: ${context.trim()}` : null,
      `Essay to review:\n\n${essay.trim()}`,
    ].filter(Boolean).join('\n\n')

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
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}))
      console.error('Anthropic API error:', anthropicRes.status, errBody)
      return json({ reply: "I'm having trouble reaching the AI right now. Please try again in a moment." })
    }

    const anthropicData = await anthropicRes.json()
    const reply = anthropicData.content?.[0]?.text ?? "I couldn't generate feedback. Please try again."

    return json({ reply })
  } catch (err) {
    console.error('review-essay error:', err)
    return json({ reply: "Something went wrong on my end. Please try again in a moment." })
  }
})
