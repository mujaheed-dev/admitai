// @ts-nocheck
// Runs in Supabase's Deno runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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

    // 2. Explicitly delete all user rows.
    //    All tables have ON DELETE CASCADE so deleting the auth user would
    //    cascade anyway — but being explicit is safer and faster.
    await Promise.all([
      supabase.from('user_boards').delete().eq('user_id', uid),
      supabase.from('ai_usage').delete().eq('user_id', uid),
      supabase.from('chat_messages').delete().eq('user_id', uid),
      supabase.from('applications').delete().eq('user_id', uid),
    ])

    // 3. Delete the auth user — requires service role.
    const { error: deleteError } = await supabase.auth.admin.deleteUser(uid)
    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
      return json({ error: 'Failed to delete account. Please contact support.' }, 500)
    }

    return json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return json({ error: 'An unexpected error occurred.' }, 500)
  }
})
