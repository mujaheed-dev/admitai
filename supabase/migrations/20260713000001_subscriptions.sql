-- Subscriptions: one row per user, written ONLY by edge functions using the
-- service role (webhook + verify-payment). Users can read their own row via
-- RLS; there are deliberately NO insert/update/delete policies, so nothing a
-- browser does can grant itself a plan.

create table if not exists public.subscriptions (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  plan               text not null check (plan in ('undergrad', 'postgrad', 'combined')),
  status             text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  -- Access runs until this moment. Each successful monthly charge (webhook)
  -- pushes it forward. 'cancelled' users keep access until it passes — they
  -- paid for the period.
  current_period_end timestamptz not null,
  flw_tx_ref         text,          -- our reference sent to Flutterwave
  flw_tx_id          text,          -- Flutterwave transaction id (verify API)
  flw_subscription_id text,         -- Flutterwave subscription id (from webhook)
  flw_customer_email text,          -- email Flutterwave has for this subscriber
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Monthly fair-use counter for paid users, alongside the existing lifetime
-- free counter (searches_used). month_key is 'YYYY-MM'; when it doesn't match
-- the current month the counter is treated as 0 and overwritten.
alter table public.ai_usage
  add column if not exists month_key text,
  add column if not exists monthly_used integer not null default 0;
