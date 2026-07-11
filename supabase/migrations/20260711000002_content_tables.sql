-- Step 2: move AdmitAI's dataset from code into the database.
-- Four tables mirroring how the data is used today:
--   country_blocks / scholarship_blocks / university_blocks -> the text the
--     AI reads (served by the edge functions via the retrieval layer)
--   universities -> the structured objects the frontend renders
-- The app KEEPS reading from code until these are verified + switched over.

create table if not exists public.country_blocks (
  name text primary key,                    -- canonical name, e.g. 'Canada'
  block text not null,                      -- the destination text block
  updated_at timestamptz not null default now()
);

create table if not exists public.scholarship_blocks (
  num int primary key,                      -- current numbering 1..71
  country text,                             -- canonical country (null = multi/EU-wide)
  title text not null,                      -- first line
  block text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.university_blocks (
  id bigint generated always as identity primary key,
  country text,
  name text not null,                       -- first line up to the em-dash
  block text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.universities (
  id text primary key,                      -- slug, e.g. 'tum'
  country text not null,
  name text not null,
  verified boolean not null default false,
  data jsonb not null,                      -- the full frontend object
  updated_at timestamptz not null default now()
);

-- RLS: the AI-side block tables are service-role only (edge functions).
alter table public.country_blocks enable row level security;
alter table public.scholarship_blocks enable row level security;
alter table public.university_blocks enable row level security;

-- The frontend table is publicly readable (the app will fetch it directly).
alter table public.universities enable row level security;
create policy "universities are publicly readable"
  on public.universities for select using (true);

create index if not exists universities_country_idx on public.universities (country);
create index if not exists university_blocks_country_idx on public.university_blocks (country);
