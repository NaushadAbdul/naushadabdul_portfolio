-- ============================================================
--  Portfolio schema
--  Run this in the Supabase dashboard → SQL Editor.
-- ============================================================

-- ---------- services ----------
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  title         text        not null,
  description   text        not null default '',
  icon          text        not null default '◆',
  accent        text        not null default 'yellow'
    check (accent in ('yellow','lime','pink','blue','orange','purple')),
  display_order integer     not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists services_display_order_idx
  on public.services (display_order);

-- ---------- projects ----------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text        not null unique,
  title         text        not null,
  tagline       text        not null default '',
  description   text        not null default '',
  year          text        not null default '',
  role          text        not null default '',
  stack         text[]      not null default '{}',
  image_url     text,
  live_url      text,
  repo_url      text,
  featured      boolean     not null default false,
  accent        text        not null default 'blue'
    check (accent in ('yellow','lime','pink','blue','orange','purple')),
  display_order integer     not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists projects_display_order_idx
  on public.projects (display_order);
create index if not exists projects_featured_idx
  on public.projects (featured) where featured;

-- ---------- Row Level Security ----------
-- The site reads with the public anon key, so the tables must be
-- readable by anon but never writable by it.
alter table public.services enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Public read services" on public.services;
create policy "Public read services"
  on public.services for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies are defined, so only the service_role key
-- (used by the Supabase dashboard or scripts) can write. That is intentional.

-- ============================================================
--  Next step: run admin.sql
--  It adds the contact-form inbox (`messages`), the admin tables and the
--  Storage buckets. The public schema above is enough to render the site,
--  but the contact form and /admin need what is in admin.sql.
