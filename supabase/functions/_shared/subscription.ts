// @ts-nocheck
// Server-side subscription checks shared by every AI edge function.
// All enforcement happens here, behind the service role — nothing the
// browser sends can bypass it.

// ═══════════════════════════════════════════════════════════════════════════
// FAIR-USE CAP — paid users get "unlimited" AI within this many requests per
// calendar month (chat + roadmap + essay review + CV builder + interview prep
// share one counter). 300 ≈ 10 a day: far beyond honest use of an application
// season, cheap insurance against scripted abuse. Change the number here and
// redeploy the AI functions — nothing else references it.
// ═══════════════════════════════════════════════════════════════════════════
export const FAIR_USE_MONTHLY_CAP = 300

// Returns { plan, status, current_period_end } if the user currently has paid
// access, else null. 'cancelled' still counts until the period ends — they
// paid for it; 'expired' or a past period_end means no access.
export async function getActiveSubscription(admin, userId) {
  const { data } = await admin
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .maybeSingle()
  if (!data) return null
  if (data.status !== 'active' && data.status !== 'cancelled') return null
  if (new Date(data.current_period_end) <= new Date()) return null
  return data
}

// Read this month's paid-usage count. The counter auto-resets when the stored
// month_key is stale — no cron needed.
export async function checkFairUse(admin, userId) {
  const monthKey = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
  const { data } = await admin
    .from('ai_usage')
    .select('monthly_used, month_key')
    .eq('user_id', userId)
    .maybeSingle()
  const used = data?.month_key === monthKey ? (data?.monthly_used ?? 0) : 0
  return { allowed: used < FAIR_USE_MONTHLY_CAP, used, monthKey }
}

// Count one paid use (call only after a successful AI call, mirroring how the
// free counter works). `fair` is the object checkFairUse returned.
export async function bumpFairUse(admin, userId, fair) {
  await admin.from('ai_usage').upsert(
    {
      user_id: userId,
      month_key: fair.monthKey,
      monthly_used: fair.used + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
}
