// @ts-nocheck
// Flutterwave integration shared by create-subscription, flutterwave-webhook
// and verify-payment. The secret key lives ONLY in the FLW_SECRET_KEY Supabase
// secret — it is never sent to, or readable from, the browser.

// ═══════════════════════════════════════════════════════════════════════════
// ►►► PASTE YOUR FLUTTERWAVE PAYMENT PLAN IDs HERE (test-mode IDs for now) ◄◄◄
// Dashboard → Payments → Payment plans → each plan's ID (a number like 12345).
// These are the ONLY three placeholders in the whole build.
// ═══════════════════════════════════════════════════════════════════════════
export const FLW_PLANS = {
  undergrad: { flwPlanId: '163817', name: 'Undergraduate', amount: 14.99 },
  postgrad: { flwPlanId: '163818', name: 'Postgraduate (Masters/PhD)', amount: 21.99 },
  combined: { flwPlanId: '163819', name: 'Combined / Family', amount: 29.99 },
};

// How much access one successful monthly charge buys. 30 days + a 2-day grace
// window so a subscriber isn't locked out while Flutterwave retries a renewal.
export const PERIOD_DAYS = 32

const FLW_API = 'https://api.flutterwave.com/v3'

// Verify a transaction with Flutterwave's server-side verify API and, if it is
// a genuine successful charge for one of our plans, activate/extend the
// subscription row. This is the ONLY code path that grants a plan — both the
// webhook and the post-checkout redirect funnel through it, so a forged
// webhook body or a tampered redirect URL can never mark anyone subscribed.
//
// Returns { ok: true, plan, userId } or { ok: false, reason }.
export async function verifyAndActivate(admin, transactionId, expectedUserId = null) {
  const secretKey = Deno.env.get('FLW_SECRET_KEY')
  if (!secretKey) return { ok: false, reason: 'FLW_SECRET_KEY not configured' }

  const res = await fetch(`${FLW_API}/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  if (!res.ok) return { ok: false, reason: `verify API returned ${res.status}` }

  const body = await res.json()
  const tx = body?.data
  if (body?.status !== 'success' || !tx) return { ok: false, reason: 'transaction not found' }

  // 1. The charge itself must have succeeded.
  if (tx.status !== 'successful') return { ok: false, reason: `charge status is '${tx.status}'` }

  // 2. It must reference a user and plan we sent in meta at checkout time.
  const userId = tx.meta?.user_id
  const planKey = tx.meta?.plan_key
  const plan = FLW_PLANS[planKey]
  if (!userId || !plan) return { ok: false, reason: 'missing user/plan metadata' }
  if (expectedUserId && userId !== expectedUserId) {
    return { ok: false, reason: 'transaction belongs to a different user' }
  }

  // 3. Amount and currency must match the plan — never trust the client's
  //    idea of what was paid.
  if (tx.currency !== 'USD' || Number(tx.amount) < plan.amount) {
    return { ok: false, reason: `amount/currency mismatch (${tx.amount} ${tx.currency})` }
  }

  // 4. All checks passed — activate or extend the subscription.
  const periodEnd = new Date(Date.now() + PERIOD_DAYS * 24 * 60 * 60 * 1000)
  const { error } = await admin.from('subscriptions').upsert(
    {
      user_id: userId,
      plan: planKey,
      status: 'active',
      current_period_end: periodEnd.toISOString(),
      flw_tx_ref: tx.tx_ref ?? null,
      flw_tx_id: String(tx.id),
      flw_customer_email: tx.customer?.email ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
  if (error) {
    console.error('subscription upsert failed:', error.message)
    return { ok: false, reason: 'database write failed' }
  }

  return { ok: true, plan: planKey, userId }
}

// List a customer's Flutterwave subscriptions by email.
async function flwGetSubscriptions(secretKey: string, email: string) {
  const res = await fetch(`${FLW_API}/subscriptions?email=${encodeURIComponent(email)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  if (!res.ok) throw new Error(`FLW subscriptions list returned ${res.status}`)
  const body = await res.json()
  if (body?.status !== 'success') throw new Error('FLW subscriptions list not successful')
  return Array.isArray(body.data) ? body.data : []
}

// Cancel EVERY active Flutterwave subscription for this customer email so they
// are never billed again. Used by cancel-subscription (on user request) and
// delete-account (before wiping data). Called server-side only — never the
// browser — because it needs FLW_SECRET_KEY.
//
// Returns { found, cancelled, subscriptionId }. Throws only if the Flutterwave
// API is unreachable or a cancel call fails — an empty list (nothing active to
// cancel, e.g. already cancelled) is a normal, successful outcome so callers
// can treat "found: 0" as "nothing to do".
export async function cancelFlwSubscriptionsByEmail(email: string | null) {
  const secretKey = Deno.env.get('FLW_SECRET_KEY')
  if (!secretKey) throw new Error('FLW_SECRET_KEY not configured')
  if (!email) return { found: 0, cancelled: 0, subscriptionId: null }

  const subs = await flwGetSubscriptions(secretKey, email)
  const active = subs.filter((s: any) => String(s.status).toLowerCase() === 'active')

  let cancelled = 0
  let subscriptionId: string | null = null
  for (const s of active) {
    const res = await fetch(`${FLW_API}/subscriptions/${s.id}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    // A failed cancel must surface — silently swallowing it would let the
    // customer be billed again despite our promise not to.
    if (!res.ok) throw new Error(`FLW cancel of subscription ${s.id} returned ${res.status}`)
    cancelled++
    subscriptionId = String(s.id)
  }
  return { found: active.length, cancelled, subscriptionId }
}
