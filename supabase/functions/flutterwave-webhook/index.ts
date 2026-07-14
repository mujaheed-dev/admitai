// @ts-nocheck
// Receives Flutterwave webhooks. Deploy with --no-verify-jwt (Flutterwave
// cannot send a Supabase JWT). Security comes from TWO independent checks:
//   1. The 'verif-hash' header must equal our FLW_WEBHOOK_HASH secret
//      (the "secret hash" configured in the Flutterwave dashboard).
//   2. Even then, we never trust the webhook body — the transaction is
//      re-verified against Flutterwave's verify API before anything is
//      written (verifyAndActivate in _shared/flw.ts).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyAndActivate } from '../_shared/flw.ts'

// Constant-time string compare — avoids leaking the hash via timing.
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  // ── 1. Signature check ────────────────────────────────────────────────────
  const expected = Deno.env.get('FLW_WEBHOOK_HASH')
  const received = req.headers.get('verif-hash')
  if (!expected || !received || !safeEqual(received, expected)) {
    console.error('Webhook rejected: bad or missing verif-hash')
    return new Response('Unauthorized', { status: 401 })
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const event = await req.json()
    const type = event?.event ?? event?.['event.type'] ?? ''

    // ── 2. Successful charge (first payment AND monthly renewals) ───────────
    if (type === 'charge.completed' && event?.data?.status === 'successful') {
      const result = await verifyAndActivate(admin, event.data.id)
      if (!result.ok) {
        // Log and still return 200 — a bad/foreign transaction is not a
        // delivery failure, and returning 5xx would make Flutterwave retry
        // something that will never succeed.
        console.error(`charge.completed tx ${event.data.id} not activated: ${result.reason}`)
      } else {
        console.log(`Activated/renewed '${result.plan}' for user ${result.userId} (tx ${event.data.id})`)
      }
      return new Response('ok', { status: 200 })
    }

    // ── 3. Subscription cancelled in Flutterwave ─────────────────────────────
    // Mark as cancelled; access continues until current_period_end (paid for).
    if (type === 'subscription.cancelled') {
      const email = event?.data?.customer?.email ?? event?.data?.customer?.customer_email
      if (email) {
        const { error } = await admin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            flw_subscription_id: event?.data?.id ? String(event.data.id) : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('flw_customer_email', email)
          .eq('status', 'active')
        if (error) console.error('cancel update failed:', error.message)
        else console.log(`Marked subscription cancelled for ${email}`)
      }
      return new Response('ok', { status: 200 })
    }

    // Anything else (failed charges, other events): acknowledge and ignore.
    console.log(`Ignoring webhook event '${type}'`)
    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    // 200 so Flutterwave doesn't retry a body we already can't parse.
    return new Response('ok', { status: 200 })
  }
})
