// @ts-nocheck
// Cancels the logged-in user's monthly subscription.
// Policy: cancel anytime, no refund for the current month, but keep full
// access until the end of the paid period, and never bill again.
//
// This calls Flutterwave server-side (FLW_SECRET_KEY) to actually stop the
// recurring billing, then marks the row 'cancelled' while KEEPING
// current_period_end — so getActiveSubscription() still grants access until
// that date, after which the user reverts to free automatically.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { reportError } from '../_shared/sentry.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { cancelFlwSubscriptionsByEmail } from '../_shared/flw.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    // ── 1. Authenticate — only the owner can cancel their own plan ──────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await admin.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // ── 2. Find their subscription row ──────────────────────────────────────
    const { data: sub } = await admin
      .from('subscriptions')
      .select('plan, status, current_period_end, flw_customer_email')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!sub) return json({ error: 'You don’t have a subscription to cancel.' }, 400)
    if (sub.status === 'cancelled') {
      // Idempotent: already cancelled — just report the access-until date.
      return json({ ok: true, alreadyCancelled: true, accessUntil: sub.current_period_end, plan: sub.plan })
    }

    // ── 3. Stop recurring billing at Flutterwave (server-side) ──────────────
    // Prefer the email Flutterwave has on file for the subscription; fall back
    // to the account email. If this throws, we do NOT mark the row cancelled —
    // we surface the error so the user can retry rather than being told
    // "cancelled" while billing quietly continues.
    const email = sub.flw_customer_email || user.email
    let flwSubscriptionId = null
    try {
      const result = await cancelFlwSubscriptionsByEmail(email)
      flwSubscriptionId = result.subscriptionId
      console.log(`Cancelled ${result.cancelled}/${result.found} FLW subscription(s) for ${email}`)
    } catch (err) {
      console.error('Flutterwave cancel failed:', err?.message ?? err)
      await reportError(err, { fn: 'cancel-subscription', stage: 'flw-cancel', userId: user.id })
      return json({
        error: 'We couldn’t reach the payment provider to cancel. Please try again in a moment.',
      }, 502)
    }

    // ── 4. Mark cancelled, KEEP access until the paid period ends ───────────
    const { error: updateError } = await admin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        flw_subscription_id: flwSubscriptionId ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('subscription cancel update failed:', updateError.message)
      return json({ error: 'Cancelled billing, but failed to update your record. Please contact support.' }, 500)
    }

    return json({ ok: true, accessUntil: sub.current_period_end, plan: sub.plan })
  } catch (err) {
    console.error('cancel-subscription error:', err)
    await reportError(err, { fn: 'cancel-subscription' })
    return json({ error: 'Something went wrong — please try again.' }, 500)
  }
})
