-- ============================================================
--  Admin dashboard schema
--  Run this AFTER schema.sql. Safe to run more than once.
--
--  Adds: admins, site_settings, skills, experience,
--        testimonials, messages + storage buckets + RLS.
-- ============================================================

-- ============================================================
--  1. Admin identity
-- ============================================================
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Users may confirm their own admin status; nobody can enumerate the rest.
drop policy if exists "Read own admin row" on public.admins;
create policy "Read own admin row"
  on public.admins for select
  to authenticated
  using (auth.uid() = user_id);

-- SECURITY DEFINER so policies can consult this table without RLS recursion.
-- search_path is pinned to defend against search-path hijacking.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
--  2. Shared updated_at trigger
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
--  3. site_settings — exactly one row, enforced by the PK check
-- ============================================================
create table if not exists public.site_settings (
  id             smallint primary key default 1 check (id = 1),
  -- identity
  full_name      text not null default 'Your Name',
  initials       text not null default 'YN',
  role           text not null default 'Developer',
  -- hero / about
  tagline        text not null default 'Build / Automate / Empower',
  description    text not null default '',
  bio            text not null default '',
  focus          text not null default '',
  availability   text not null default '',
  location       text not null default '',
  -- contact + files
  email          text not null default '',
  resume_url     text,
  portrait_url   text,
  -- socials
  linkedin_url   text,
  github_url     text,
  x_url          text,
  instagram_url  text,
  updated_at     timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists touch_site_settings_updated_at on public.site_settings;
create trigger touch_site_settings_updated_at before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ============================================================
--  4. skills
-- ============================================================
create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null default 'General',
  level         smallint not null default 3 check (level between 1 and 5),
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists skills_display_order_idx on public.skills (display_order);

drop trigger if exists touch_skills_updated_at on public.skills;
create trigger touch_skills_updated_at before update on public.skills
  for each row execute function public.touch_updated_at();

-- ============================================================
--  5. experience
-- ============================================================
create table if not exists public.experience (
  id            uuid primary key default gen_random_uuid(),
  role          text not null,
  company       text not null,
  company_url   text,
  location      text not null default '',
  start_date    text not null default '',
  end_date      text not null default '',
  is_current    boolean not null default false,
  description   text not null default '',
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists experience_display_order_idx on public.experience (display_order);

drop trigger if exists touch_experience_updated_at on public.experience;
create trigger touch_experience_updated_at before update on public.experience
  for each row execute function public.touch_updated_at();

-- ============================================================
--  6. testimonials
-- ============================================================
create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  quote          text not null,
  author_name    text not null,
  author_role    text not null default '',
  author_company text not null default '',
  avatar_url     text,
  featured       boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists testimonials_display_order_idx on public.testimonials (display_order);

drop trigger if exists touch_testimonials_updated_at on public.testimonials;
create trigger touch_testimonials_updated_at before update on public.testimonials
  for each row execute function public.touch_updated_at();

-- ============================================================
--  7. messages — contact form inbox
-- ============================================================
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_unread_idx on public.messages (is_read) where not is_read;

-- ============================================================
--  8. updated_at on the tables from schema.sql
-- ============================================================
alter table public.projects add column if not exists updated_at timestamptz not null default now();
alter table public.services add column if not exists updated_at timestamptz not null default now();

drop trigger if exists touch_projects_updated_at on public.projects;
create trigger touch_projects_updated_at before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_services_updated_at on public.services;
create trigger touch_services_updated_at before update on public.services
  for each row execute function public.touch_updated_at();

-- ============================================================
--  9. Row Level Security
--     Public reads everywhere; writes require an admin.
-- ============================================================

-- ---------- public read + admin write ----------
alter table public.site_settings enable row level security;
alter table public.skills        enable row level security;
alter table public.experience    enable row level security;
alter table public.testimonials  enable row level security;

drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "Admin write settings" on public.site_settings;
create policy "Admin write settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read skills" on public.skills;
create policy "Public read skills" on public.skills
  for select to anon, authenticated using (true);

drop policy if exists "Admin write skills" on public.skills;
create policy "Admin write skills" on public.skills
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read experience" on public.experience;
create policy "Public read experience" on public.experience
  for select to anon, authenticated using (true);

drop policy if exists "Admin write experience" on public.experience;
create policy "Admin write experience" on public.experience
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials" on public.testimonials
  for select to anon, authenticated using (true);

drop policy if exists "Admin write testimonials" on public.testimonials;
create policy "Admin write testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- projects + services: reads already public, add admin writes ----------
drop policy if exists "Admin write projects" on public.projects;
create policy "Admin write projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin write services" on public.services;
create policy "Admin write services" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- messages: anon may write, only admins may read ----------
alter table public.messages enable row level security;

drop policy if exists "Public insert messages" on public.messages;
create policy "Public insert messages" on public.messages
  for insert to anon, authenticated with check (true);

drop policy if exists "Admin read messages" on public.messages;
create policy "Admin read messages" on public.messages
  for select to authenticated using (public.is_admin());

drop policy if exists "Admin update messages" on public.messages;
create policy "Admin update messages" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin delete messages" on public.messages;
create policy "Admin delete messages" on public.messages
  for delete to authenticated using (public.is_admin());

-- ============================================================
-- 10. Storage buckets
--     media  → project images, avatars, portrait
--     resume → downloadable CV
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('resume', 'resume', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('media', 'resume'));

drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media', 'resume') and public.is_admin());

drop policy if exists "Admin update media" on storage.objects;
create policy "Admin update media" on storage.objects
  for update to authenticated
  using (bucket_id in ('media', 'resume') and public.is_admin());

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media', 'resume') and public.is_admin());

-- ============================================================
-- 11. BOOTSTRAP — do this once, after creating your user
--
--   a) Dashboard → Authentication → Users → "Add user"
--      Enter your email + password and tick "Auto Confirm User".
--      (Or sign up through /admin/login, then confirm the email.)
--   b) Disable further sign-ups: Authentication → Sign In / Providers
--      → Email → turn OFF "Allow new users to sign up".
--   c) Then run this with your email, to grant yourself admin:
-- ============================================================
-- insert into public.admins (user_id)
-- select id from auth.users where lower(email) = lower('you@example.com')
-- on conflict (user_id) do nothing;
--
-- Check what happened (0 rows means the email did not match anything):
-- select u.id, u.email, (a.user_id is not null) as is_admin
-- from auth.users u
-- left join public.admins a on a.user_id = u.id
-- order by u.created_at;
