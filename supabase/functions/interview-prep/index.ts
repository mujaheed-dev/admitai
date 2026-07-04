// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// ─── interview configuration ─────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  scholarship: 'Scholarship',
  university:  'University Admission',
  visa:        'Visa',
}

const TYPE_QUESTIONS: Record<string, string> = {
  scholarship: `Ask 5 questions across these themes (in a natural order):
1. Why they deserve this scholarship and what makes them stand out
2. Their long-term goals and how this scholarship supports them
3. A challenge they've overcome and what they learned from it
4. Leadership or community impact — with a concrete example
5. How they plan to give back or contribute after their studies`,

  university: `Ask 5 questions across these themes (in a natural order):
1. Who they are and why they chose this field of study
2. Why this specific university — what drew them to it
3. Their greatest academic strength with a real example
4. A difficulty they've faced and how they handled it
5. Their plans for the future — where they see themselves in 5–10 years`,

  visa: `Ask 5 questions in a professional, direct visa-officer style:
1. What they will study, at which institution, and when they received acceptance
2. Why they chose to study abroad rather than in their home country
3. How their studies are being funded — who is paying, how much, and what proof exists
4. Their plans after completing the degree — specifically, will they return home?
5. Their ties to their home country — family, property, employment offers, or other commitments`,
}

function buildSystemPrompt(interviewType: string): string {
  const label = TYPE_LABELS[interviewType] ?? 'Interview'
  const questions = TYPE_QUESTIONS[interviewType] ?? TYPE_QUESTIONS.scholarship

  return `You are AdmitAI's Interview Prep coach. You conduct a friendly, realistic mock ${label} interview with a student who wants to build confidence before the real thing.

━━━ YOUR ROLE ━━━
You play the interviewer. Begin with a warm one-sentence welcome, then ask your first question. After each student answer:

1. Write "**Feedback:**" then give 2–3 sentences: name one specific thing that was strong (quote or paraphrase the student's words), then give ONE concrete, actionable improvement. Be specific — not "good job" but "your point about X was strong because it showed Y."

2. Immediately ask your next question on a new line.

━━━ TONE RULES — NEVER BREAK ━━━
• WARM AND ENCOURAGING: Students are nervous. Be supportive even when the feedback is critical.
• SPECIFIC: Name exactly what worked or didn't. Vague praise is not helpful.
• HONEST: If an answer was weak or off-topic, say so gently and explain how to fix it. Don't just praise everything.
• NO GUARANTEES: Never promise admission, scholarship success, or visa approval. This is practice, not prediction.
• CONVERSATIONAL: Keep questions and feedback concise. Don't lecture.

━━━ STRUCTURE ━━━
Ask exactly 5 questions, one at a time. After the student answers the 5th question:
- Give feedback on that final answer.
- Then write a warm overall summary using these exact headers:
  **What you did well:**
  [3 specific strengths from across the whole interview]

  **Areas to develop:**
  [2–3 specific, actionable improvements for the real interview]

  **You're ready to practice!**
  [1–2 encouraging closing sentences. Remind them this preparation makes a real difference.]

- End with exactly: [INTERVIEW COMPLETE]

━━━ QUESTION GUIDANCE FOR THIS ${label.toUpperCase()} INTERVIEW ━━━
${questions}

Vary your phrasing naturally — don't robotically number questions. Sound like a real interviewer.`
}

// ─── handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // Paid-only feature — zero free uses, enforced server-side. No billing
    // system exists yet, so every account is free and this always returns the
    // upgrade signal. Swap `isPaid` for a real plan check once payments ship —
    // the interview flow below will then run for paid users.
    const isPaid = false
    if (!isPaid) return json({ paidOnly: true })

    const { interviewType, history } = await req.json()

    if (!interviewType || !TYPE_LABELS[interviewType]) {
      return json({ error: 'Invalid interview type.' }, 400)
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) return json({ reply: 'AI not configured — please contact support.' })

    // ── Build message history for Claude ──────────────────────────────────────
    // Strip [INTERVIEW COMPLETE] from history so Claude doesn't see its own tags echoed back
    const cleanHistory = (history ?? []).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content.replace('[INTERVIEW COMPLETE]', '').trim(),
    }))

    const messages = cleanHistory.length > 0
      ? cleanHistory
      : [{ role: 'user', content: 'Please start the mock interview now.' }]

    // ── Call Claude ────────────────────────────────────────────────────────────
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: buildSystemPrompt(interviewType),
        messages,
      }),
    })

    if (!anthropicRes.ok) {
      console.error('Anthropic error:', anthropicRes.status)
      return json({ reply: "Trouble reaching the AI — please try again in a moment." })
    }

    const anthropicData = await anthropicRes.json()
    const reply = anthropicData.content?.[0]?.text ?? "Couldn't generate a response. Please try again."
    const isComplete = reply.includes('[INTERVIEW COMPLETE]')

    return json({ reply, isComplete })
  } catch (err) {
    console.error('interview-prep error:', err)
    return json({ reply: "Something went wrong. Please try again in a moment." })
  }
})
