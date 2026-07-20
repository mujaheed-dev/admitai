// @ts-nocheck
// Runs in Supabase's Deno runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { reportError } from '../_shared/sentry.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { cancelFlwSubscriptionsByEmail } from '../_shared/flw.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    // 1. Authenticate — only the real owner can delete their own account.
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!,
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    const uid = user.id

    // 2. Cancel any active Flutterwave subscription FIRST, so nobody is billed
    //    after their account (and its data) is gone. Best-effort: a user
    //    leaving must never be blocked from deleting. "No subscription" and a
    //    provider hiccup are both handled gracefully — we log and proceed.
    try {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('flw_customer_email')
        .eq('user_id', uid)
        .maybeSingle()
      const email = sub?.flw_customer_email || user.email
      const result = await cancelFlwSubscriptionsByEmail(email)
      if (result.found > 0) console.log(`delete-account: cancelled ${result.cancelled} FLW subscription(s) for ${email}`)
    } catch (err) {
      // Do not abort deletion — just record it for follow-up (billing risk:
      // the account is going away but a subscription may still be active).
      console.error('delete-account: Flutterwave cancel failed (continuing with deletion):', err?.message ?? err)
      await reportError(err, { fn: 'delete-account', stage: 'flw-cancel', userId: uid, note: 'billing-risk: sub may remain active after deletion' })
    }

    // 3. Explicitly delete all user rows.
    //    All tables have ON DELETE CASCADE so deleting the auth user would
    //    cascade anyway — but being explicit is safer and faster.
    await Promise.all([
      supabase.from('user_boards').delete().eq('user_id', uid),
      supabase.from('ai_usage').delete().eq('user_id', uid),
      supabase.from('conversations').delete().eq('user_id', uid),  // cascades to chat_messages
      supabase.from('chat_messages').delete().eq('user_id', uid),
      supabase.from('applications').delete().eq('user_id', uid),
      supabase.from('subscriptions').delete().eq('user_id', uid),
    ])

    // 4. Delete the auth user — requires service role.
    const { error: deleteError } = await supabase.auth.admin.deleteUser(uid)
    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
      return json({ error: 'Failed to delete account. Please contact support.' }, 500)
    }

    return json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    await reportError(err, { fn: 'delete-account' })
    return json({ error: 'An unexpected error occurred.' }, 500)
  }
})
