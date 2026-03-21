-- ═══════════════════════════════════════════════════════════════
--  THE BRIDE SIDE — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── WEDDINGS ──────────────────────────────────────────────────
create table public.weddings (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  couple_name     text not null default '',
  self_name       text not null default '',
  partner_name    text not null default '',
  role            text not null default 'bride' check (role in ('bride','groom','planner','other')),
  wedding_date    date,
  venue           text not null default '',
  city            text not null default '',
  total_budget    bigint not null default 0,
  vibe_tags       text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── WEDDING EVENTS ────────────────────────────────────────────
create table public.wedding_events (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid references public.weddings(id) on delete cascade not null,
  type        text not null check (type in ('wedding','reception','mehndi','sangeet','haldi','other')),
  name        text not null,
  date        date,
  venue       text not null default '',
  start_time  text not null default '',
  end_time    text not null default '',
  notes       text not null default ''
);

-- ── ITINERARY ─────────────────────────────────────────────────
create table public.itinerary_items (
  id           uuid primary key default uuid_generate_v4(),
  event_id     uuid references public.wedding_events(id) on delete cascade not null,
  wedding_id   uuid references public.weddings(id) on delete cascade not null,
  time         text not null default '',
  duration_min integer not null default 0,
  name         text not null,
  note         text not null default '',
  tags         text[] not null default '{}',
  is_milestone boolean not null default false,
  is_done      boolean not null default false,
  sort_order   integer not null default 0
);

-- ── GUESTS ────────────────────────────────────────────────────
create table public.guests (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid references public.weddings(id) on delete cascade not null,
  name        text not null,
  phone       text not null default '',
  email       text not null default '',
  side        text not null default 'bride' check (side in ('bride','groom','both')),
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending','confirmed','declined')),
  dietary     text not null default 'no-preference',
  events      text[] not null default '{}',
  plus_one    boolean not null default false,
  notes       text not null default '',
  created_at  timestamptz not null default now()
);

-- ── VENDORS ───────────────────────────────────────────────────
create table public.vendors (
  id              uuid primary key default uuid_generate_v4(),
  wedding_id      uuid references public.weddings(id) on delete cascade not null,
  name            text not null,
  category        text not null,
  city            text not null default '',
  rating          numeric(3,1) not null default 0,
  reviews_count   integer not null default 0,
  price_from      bigint not null default 0,
  price_to        bigint not null default 0,
  tags            text[] not null default '{}',
  status          text not null default 'saved' check (status in ('saved','contacted','quoted','booked','rejected')),
  notes           text not null default '',
  contact_name    text not null default '',
  contact_phone   text not null default '',
  contact_email   text not null default '',
  booked_amount   bigint not null default 0,
  paid_amount     bigint not null default 0,
  is_shortlisted  boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ── BUDGET CATEGORIES ─────────────────────────────────────────
create table public.budget_categories (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid references public.weddings(id) on delete cascade not null,
  name        text not null,
  emoji       text not null default '💰',
  allocated   bigint not null default 0,
  sort_order  integer not null default 0
);

-- ── EXPENSES ──────────────────────────────────────────────────
create table public.expenses (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid references public.budget_categories(id) on delete cascade not null,
  wedding_id   uuid references public.weddings(id) on delete cascade not null,
  vendor_name  text not null,
  description  text not null default '',
  amount       bigint not null default 0,
  status       text not null default 'pending' check (status in ('paid','pending','due_soon','overdue')),
  due_date     date,
  paid_date    date,
  created_at   timestamptz not null default now()
);

-- ── CHECKLIST CATEGORIES ──────────────────────────────────────
create table public.checklist_categories (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid references public.weddings(id) on delete cascade not null,
  name        text not null,
  sort_order  integer not null default 0,
  badge_label text not null default 'To Do'
);

-- ── CHECKLIST TASKS ───────────────────────────────────────────
create table public.checklist_tasks (
  id             uuid primary key default uuid_generate_v4(),
  category_id    uuid references public.checklist_categories(id) on delete cascade not null,
  wedding_id     uuid references public.weddings(id) on delete cascade not null,
  name           text not null,
  is_done        boolean not null default false,
  cost_estimate  bigint,
  due_date       date,
  assigned_to    text not null default '',
  sort_order     integer not null default 0
);

-- ── MOODBOARD PINS ────────────────────────────────────────────
create table public.mood_pins (
  id            uuid primary key default uuid_generate_v4(),
  wedding_id    uuid references public.weddings(id) on delete cascade not null,
  image_url     text not null,
  storage_path  text,
  caption       text not null default '',
  category      text not null default 'other',
  is_liked      boolean not null default false,
  color_palette text[] not null default '{}',
  created_at    timestamptz not null default now()
);

-- ── NOTES / MOM ───────────────────────────────────────────────
create table public.notes (
  id          uuid primary key default uuid_generate_v4(),
  wedding_id  uuid references public.weddings(id) on delete cascade not null,
  title       text not null,
  body        text not null default '',
  type        text not null default 'general' check (type in ('mom','general','vendor')),
  vendor_id   uuid references public.vendors(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

alter table public.weddings            enable row level security;
alter table public.wedding_events      enable row level security;
alter table public.itinerary_items     enable row level security;
alter table public.guests              enable row level security;
alter table public.vendors             enable row level security;
alter table public.budget_categories   enable row level security;
alter table public.expenses            enable row level security;
alter table public.checklist_categories enable row level security;
alter table public.checklist_tasks     enable row level security;
alter table public.mood_pins           enable row level security;
alter table public.notes               enable row level security;

-- Helper function
create or replace function public.my_wedding_ids()
returns setof uuid language sql stable security definer as $$
  select id from public.weddings where user_id = auth.uid()
$$;

-- Weddings: owner only
create policy "owner" on public.weddings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- All child tables: belongs to user's wedding
do $$ declare
  tbl text;
begin
  foreach tbl in array array[
    'wedding_events','itinerary_items','guests','vendors',
    'budget_categories','expenses','checklist_categories',
    'checklist_tasks','mood_pins','notes'
  ] loop
    execute format(
      'create policy "owner" on public.%I for all
       using (wedding_id in (select public.my_wedding_ids()))
       with check (wedding_id in (select public.my_wedding_ids()))',
      tbl
    );
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════════
--  UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger set_updated_at before update on public.weddings
  for each row execute procedure public.set_updated_at();

create trigger set_updated_at before update on public.notes
  for each row execute procedure public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
--  STORAGE BUCKET (run after schema)
-- ═══════════════════════════════════════════════════════════════
-- insert into storage.buckets (id, name, public) values ('moodboard', 'moodboard', false);
-- create policy "owner upload" on storage.objects for insert
--   with check (bucket_id = 'moodboard' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "owner read" on storage.objects for select
--   using (bucket_id = 'moodboard' and auth.uid()::text = (storage.foldername(name))[1]);
