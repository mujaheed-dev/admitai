// @ts-nocheck
// Called by the app right after Flutterwave redirects the user back, so the
// plan activates immediately instead of waiting on webhook delivery. Runs the
// exact same server-side verification as the webhook (verifyAndActivate) —
// the transaction_id from the URL is just a lookup key, never trusted.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { reportError } from '../_shared/sentry.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { verifyAndActivate } from '../_shared/flw.ts'

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

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await admin.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // ── 2. Verify with Flutterwave and activate ─────────────────────────────
    const { transactionId } = await req.json()
    if (!transactionId) return json({ error: 'transactionId is required' }, 400)

    // expectedUserId ties activation to the caller: even a valid transaction
    // id lifted from someone else's URL activates nothing for this account.
    const result = await verifyAndActivate(admin, transactionId, user.id)

    if (!result.ok) {
      console.error(`verify-payment: tx ${transactionId} for ${user.id} failed: ${result.reason}`)
      return json({ active: false })
    }
    return json({ active: true, plan: result.plan })
  } catch (err) {
    console.error('Unexpected error:', err)
    await reportError(err, { fn: 'verify-payment' })
    return json({ error: 'Something went wrong — please try again.' }, 500)
  }
})
