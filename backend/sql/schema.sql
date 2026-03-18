-- Enable required extension for uuid generation
create extension if not exists pgcrypto;

-- profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- artworks
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists artworks_user_id_idx on public.artworks(user_id);
create index if not exists artworks_sort_order_idx on public.artworks(user_id, sort_order);

-- portfolios
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  slug text unique not null,
  template_name text default 'minimal',
  title text,
  bio text,
  is_published boolean default false,
  customization jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint portfolios_template_name_check
    check (template_name in ('minimal', 'dark', 'magazine', 'cyber', 'brutalist', 'ethereal'))
);

create index if not exists portfolios_slug_idx on public.portfolios(slug);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_portfolios_updated_at on public.portfolios;
create trigger set_portfolios_updated_at
before update on public.portfolios
for each row
execute function public.update_updated_at_column();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.portfolios enable row level security;

-- profiles policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- artworks policies
drop policy if exists "Users can read own artworks" on public.artworks;
create policy "Users can read own artworks"
on public.artworks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own artworks" on public.artworks;
create policy "Users can insert own artworks"
on public.artworks
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own artworks" on public.artworks;
create policy "Users can update own artworks"
on public.artworks
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own artworks" on public.artworks;
create policy "Users can delete own artworks"
on public.artworks
for delete
to authenticated
using (auth.uid() = user_id);

-- portfolios policies
drop policy if exists "Users can read own portfolio" on public.portfolios;
create policy "Users can read own portfolio"
on public.portfolios
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own portfolio" on public.portfolios;
create policy "Users can insert own portfolio"
on public.portfolios
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own portfolio" on public.portfolios;
create policy "Users can update own portfolio"
on public.portfolios
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own portfolio" on public.portfolios;
create policy "Users can delete own portfolio"
on public.portfolios
for delete
to authenticated
using (auth.uid() = user_id);

-- Public read policy only for published portfolios
drop policy if exists "Public can read published portfolios" on public.portfolios;
create policy "Public can read published portfolios"
on public.portfolios
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read artworks from published portfolios" on public.artworks;
create policy "Public can read artworks from published portfolios"
on public.artworks
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.user_id = artworks.user_id
      and p.is_published = true
  )
);
