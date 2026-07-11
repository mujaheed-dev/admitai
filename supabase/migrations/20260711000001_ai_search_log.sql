-- Step 1: the "suggestion box" — log what users ask the AI for, and whether
-- our dataset covered it. Rows with matched_countries = {} are coverage gaps:
-- the ranked list of what to add next.
create table if not exists public.ai_search_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid,
  message text not null,
  matched_countries text[] not null default '{}'
);

comment on table public.ai_search_log is
  'Every ask-admitai query with the countries the retrieval layer matched. Empty matched_countries = coverage gap.';

-- Only the edge functions (service role) may read/write; no public access.
alter table public.ai_search_log enable row level security;

create index if not exists ai_search_log_created_idx
  on public.ai_search_log (created_at desc);

-- Fast "top gaps" queries
create index if not exists ai_search_log_gap_idx
  on public.ai_search_log (created_at desc)
  where matched_countries = '{}';
