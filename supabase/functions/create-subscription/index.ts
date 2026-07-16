// @ts-nocheck
// Starts a Flutterwave subscription checkout for the logged-in user.
// Called from the Pricing page; returns the hosted-checkout link the browser
// redirects to. The Flutterwave secret key never leaves this function.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { reportError } from '../_shared/sentry.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { FLW_PLANS } from '../_shared/flw.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

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

    // ── 2. Validate the requested plan ──────────────────────────────────────
    const { plan: planKey } = await req.json()
    const plan = FLW_PLANS[planKey]
    if (!plan) return json({ error: 'Unknown plan' }, 400)
    if (String(plan.flwPlanId).startsWith('PLAN_ID_')) {
      console.error(`Flutterwave plan id for '${planKey}' is still a placeholder`)
      return json({ error: 'Payments are not configured yet — plan ID missing.' }, 500)
    }

    const secretKey = Deno.env.get('FLW_SECRET_KEY')
    if (!secretKey) {
      console.error('FLW_SECRET_KEY secret is not set')
      return json({ error: 'Payments are not configured yet.' }, 500)
    }

    // ── 3. Create the hosted checkout ───────────────────────────────────────
    // Redirect back to wherever the app is served from (the browser's Origin
    // header — not a client-supplied URL). Activation does NOT depend on this
    // redirect; the webhook + verify API are the source of truth.
    const origin = req.headers.get('origin') ?? ''
    const txRef = `admitai-${planKey}-${crypto.randomUUID()}`

    const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: plan.amount,
        currency: 'USD',
        payment_plan: plan.flwPlanId,
        redirect_url: `${origin}/?flw-return=1`,
        customer: {
          email: user.email,
          name: user.user_metadata?.first_name ?? user.email,
        },
        // meta is what verifyAndActivate later trusts — set server-side only.
        meta: { user_id: user.id, plan_key: planKey },
        customizations: {
          title: 'AdmitAI',
          description: `${plan.name} plan — $${plan.amount}/month`,
        },
      }),
    })

    const flwBody = await flwRes.json().catch(() => ({}))
    if (!flwRes.ok || flwBody?.status !== 'success' || !flwBody?.data?.link) {
      console.error('Flutterwave payment init failed:', flwRes.status, JSON.stringify(flwBody).slice(0, 500))
      return json({ error: 'Could not start checkout — please try again.' }, 502)
    }

    return json({ link: flwBody.data.link, txRef })
  } catch (err) {
    console.error('Unexpected error:', err)
    await reportError(err, { fn: 'create-subscription' })
    return json({ error: 'Something went wrong — please try again.' }, 500)
  }
})
