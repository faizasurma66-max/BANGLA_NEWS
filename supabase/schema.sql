-- ============================================================================
-- AllNewspaperBangla — database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Then run supabase/seed.sql to load the directory content.
-- ============================================================================

-- ---------- Tables ----------------------------------------------------------

create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  title_bn     text,
  description  text,
  section_type text not null default 'outlet_grid'
               check (section_type in ('outlet_grid', 'division_grid')),
  parent_slug  text,
  group_key    text not null default 'portals',
  sort_order   int  not null default 0,
  show_on_home boolean not null default false,
  accent       text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.outlets (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories(id) on delete cascade,
  name          text not null,
  name_bn       text,
  slug          text,
  url           text not null,
  logo_url      text,
  description   text,
  is_featured   boolean not null default false,
  is_active     boolean not null default true,
  open_external boolean not null default false,
  sort_order    int  not null default 0,
  click_count   bigint not null default 0,
  created_at    timestamptz not null default now(),
  unique (category_id, name)
);

-- ---------- Global settings (key-value) -------------------------------------

create table if not exists public.settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- Seed the default card-open behaviour
insert into public.settings (key, value)
values ('default_open_external', 'false')
on conflict (key) do nothing;
create index if not exists outlets_category_idx on public.outlets(category_id);
create index if not exists outlets_active_idx   on public.outlets(is_active);

create table if not exists public.submissions (
  id                 uuid primary key default gen_random_uuid(),
  outlet_name        text not null,
  url                text not null,
  category_suggestion text,
  logo_url           text,
  submitter_email    text,
  notes              text,
  status             text not null default 'pending'
                     check (status in ('pending', 'approved', 'rejected')),
  created_at         timestamptz not null default now()
);
create index if not exists submissions_status_idx on public.submissions(status);

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  content      text not null,
  cover_image  text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists posts_published_idx on public.posts(published);

-- ---------- Click counter (SECURITY DEFINER so anon can increment) ----------

create or replace function public.increment_click(outlet_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.outlets set click_count = click_count + 1 where id = outlet_id;
$$;

grant execute on function public.increment_click(uuid) to anon, authenticated;

-- ---------- Row Level Security ----------------------------------------------
-- The service-role key (server-only) bypasses RLS for all admin writes.
-- These policies expose only safe public reads to the anon key.

alter table public.categories  enable row level security;
alter table public.outlets     enable row level security;
alter table public.posts       enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories" on public.categories
  for select using (is_active = true);

drop policy if exists "public read active outlets" on public.outlets;
create policy "public read active outlets" on public.outlets
  for select using (is_active = true);

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select using (published = true);

-- submissions: no anon read/write. All inserts go through the service role.

-- ---------- Logo storage bucket (public read) -------------------------------

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

drop policy if exists "public read logos" on storage.objects;
create policy "public read logos" on storage.objects
  for select using (bucket_id = 'logos');
