-- Conversations: turns the AI chat from one continuous thread per user into
-- multiple named conversations, like modern chat apps. Users see only their
-- own rows (RLS). chat_messages gains conversation_id and cascades on delete,
-- so removing a conversation removes its messages for free.

create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text,  -- null = "New chat" until the first exchange auto-titles it
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.conversations is
  'One row per AI chat conversation. title is set from the first user message once the first reply comes back.';

alter table public.conversations enable row level security;

create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can create own conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on public.conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete own conversations"
  on public.conversations for delete
  using (auth.uid() = user_id);

-- Sidebar always lists newest-active-first for one user — this index serves
-- that query directly.
create index if not exists conversations_user_updated_idx
  on public.conversations (user_id, updated_at desc);

-- ── Link chat_messages to conversations ─────────────────────────────────────
-- Nullable for now (old rows get backfilled below); new writes always set it.
alter table public.chat_messages
  add column if not exists conversation_id uuid references public.conversations(id) on delete cascade;

create index if not exists chat_messages_conversation_idx
  on public.chat_messages (conversation_id, created_at);

-- ── Migrate existing data so nothing is lost ────────────────────────────────
-- chat_messages already had an informal session_id (text, uuid-shaped) that
-- the old "History" panel grouped by. Every distinct (user_id, session_id)
-- becomes a real conversation, reusing session_id as the conversation's id
-- (both are uuid text, so this is a safe direct cast — no join table needed).
-- Anything that predates session_id (or has a malformed value) is bundled
-- into one legacy conversation per user, so no message is orphaned or lost.

do $$
declare
  uuid_re constant text := '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
begin

  -- 1) Well-formed sessions → one conversation each, same id as session_id.
  insert into public.conversations (id, user_id, title, created_at, updated_at)
  select
    session_id::uuid,
    user_id,
    left(
      coalesce((array_agg(content order by created_at) filter (where role = 'user'))[1], 'New chat'),
      60
    ),
    min(created_at),
    max(created_at)
  from public.chat_messages
  where session_id is not null
    and session_id ~ uuid_re
  group by session_id, user_id
  on conflict (id) do nothing;

  update public.chat_messages
  set conversation_id = session_id::uuid
  where conversation_id is null
    and session_id is not null
    and session_id ~ uuid_re;

  -- 2) Everything else (session_id null or not uuid-shaped) → one bundled
  -- "legacy" conversation per user, via a temp mapping table so the same
  -- generated id is used for both the insert and the backfill update.
  create temporary table _legacy_conv_map on commit drop as
  select
    user_id,
    gen_random_uuid() as new_id,
    min(created_at) as first_at,
    max(created_at) as last_at,
    left(
      coalesce((array_agg(content order by created_at) filter (where role = 'user'))[1], 'New chat'),
      60
    ) as title
  from public.chat_messages
  where conversation_id is null
    and (session_id is null or session_id !~ uuid_re)
  group by user_id;

  insert into public.conversations (id, user_id, title, created_at, updated_at)
  select new_id, user_id, title, first_at, last_at from _legacy_conv_map;

  update public.chat_messages cm
  set conversation_id = m.new_id
  from _legacy_conv_map m
  where cm.conversation_id is null
    and cm.user_id = m.user_id
    and (cm.session_id is null or cm.session_id !~ uuid_re);

end $$;

-- session_id is intentionally left in place (unused by the app going forward)
-- rather than dropped, in case you want to double-check the migration before
-- removing it permanently.
