// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { getActiveSubscription, checkFairUse, bumpFairUse } from '../_shared/subscription.ts'

const TYPE_LABELS: Record<string, string> = {
  academic:   'Academic CV',
  scholarship: 'Scholarship Application CV',
  graduate:   'Graduate School CV',
}

const TYPE_GUIDANCE: Record<string, string> = {
  academic: `This is an Academic CV. Order sections: Education first, then Academic Achievements, Research & Projects, Work/Volunteer Experience, Leadership & Activities, Skills. Highlight academic rigour and intellectual depth. Personal statements are omitted unless explicitly provided.`,
  scholarship: `This is a Scholarship Application CV. Order sections: Achievements & Awards first (this is what committees read first), then Education, Leadership & Activities, Work/Volunteer Experience, Skills, Personal Statement. The Personal Statement is especially important — if provided, it should connect the student's background to their goals and the scholarship's values. Community involvement and impact matter here.`,
  graduate: `This is a Graduate School CV (master's or PhD application). Order sections: Education first, then Research & Projects (this is the most critical section for graduate admissions), Academic Achievements, Work/Volunteer Experience, Skills, Personal Statement. The Personal Statement should articulate research interests, fit with the programme, and career goals. Highlight any publications, lab work, or research projects prominently.`,
}

const SYSTEM_PROMPT = `You are a professional CV writer helping a student create a strong CV for international university, scholarship, or graduate school applications.

━━━ CRITICAL RULES — NEVER BREAK ━━━

1. REAL INFO ONLY: Use ONLY the information the student has provided in the form. Do NOT invent, fabricate, or add any achievements, qualifications, grades, experiences, awards, skills, or any other facts the student did not mention.

2. STRENGTHEN WORDING: You may rephrase the student's points into stronger, more professional language using active verbs — but ONLY based on what was actually provided. "Helped at school event" → "Supported coordination of school fundraising event" is fine. Do NOT add invented specifics (fake numbers, fake outcomes, fake organizations).

3. EMPTY SECTIONS: If a section has no information, skip it entirely. Never fill in placeholder or invented content for empty sections.

4. HONEST = EFFECTIVE: A clean, honest CV is always more effective than an embellished one. Admissions officers are skilled at spotting exaggeration.

5. TONE: Professional, clear, warm. Use active verbs and positive framing of the student's real experience.

━━━ OUTPUT FORMAT ━━━

Generate the CV in this exact markdown structure:

# [Full Name]
[email] · [phone] · [location]  ← only include contact details that were provided; omit blank ones

---

Then include sections using ## headers, in the order specified by the CV type guidance. Only include a section if the student provided content for it.

For Experience, Activities, and Research sections, format each entry as:
**[Role or Achievement]**, [Organization] | [Date range]
- Active verb bullet describing what they did
- Second bullet if there's more to say (keep to 2 bullets max per entry)

For Education, format as:
**[Degree/Qualification]**, [Institution] | [Dates]
[Grades, GPA, or honours on the next line if provided]

Keep the entire CV to a maximum of 2 pages of content (roughly 600–900 words of body text).`

function buildUserMessage(cvType: string, form: Record<string, string>): string {
  const typeLabel = TYPE_LABELS[cvType] ?? 'Academic CV'
  const guidance  = TYPE_GUIDANCE[cvType] ?? TYPE_GUIDANCE.academic

  const sec = (label: string, val: string) => {
    const v = val?.trim()
    return v ? `\n${label.toUpperCase()}:\n${v}\n` : ''
  }

  return [
    `Please generate a ${typeLabel} for this student.`,
    '',
    `CV TYPE GUIDANCE: ${guidance}`,
    '',
    'STUDENT-PROVIDED INFORMATION (use only this):',
    sec('Full Name', form.name),
    sec('Email', form.email),
    sec('Phone', form.phone),
    sec('Location (City/Country)', form.location),
    sec('Education', form.education),
    sec('Academic Performance & Grades', form.grades),
    sec('Achievements & Awards', form.achievements),
    sec('Research & Projects', form.research),
    sec('Leadership & Activities', form.activities),
    sec('Work & Volunteer Experience', form.experience),
    sec('Skills', form.skills),
    sec('Goals & Personal Statement', form.statement),
    '',
    `Generate the ${typeLabel} now. Only include sections where real information was provided above. Do not invent anything.`,
  ].join('\n')
}

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

    // Paid-only feature — enforced server-side. Any active plan unlocks it;
    // paid use counts against the shared monthly fair-use cap.
    const sub = await getActiveSubscription(supabase, user.id)
    if (!sub) return json({ paidOnly: true })

    const fair = await checkFairUse(supabase, user.id)
    if (!fair.allowed) return json({ limitReached: true, fairUse: true })

    const { cvType, form } = await req.json()
    if (!cvType || !form?.name?.trim()) return json({ error: 'CV type and name are required.' }, 400)

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) return json({ reply: "AI not configured — please contact support." })

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserMessage(cvType, form) }],
      }),
    })

    if (!anthropicRes.ok) {
      console.error('Anthropic error:', anthropicRes.status)
      return json({ reply: "Trouble reaching the AI — please try again in a moment." })
    }

    const anthropicData = await anthropicRes.json()
    const reply = anthropicData.content?.[0]?.text ?? "Couldn't generate the CV. Please try again."

    await bumpFairUse(supabase, user.id, fair)
    return json({ reply })
  } catch (err) {
    console.error('build-cv error:', err)
    return json({ reply: "Something went wrong. Please try again in a moment." })
  }
})
