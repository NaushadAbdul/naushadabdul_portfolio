-- ============================================================
--  Admin user management
--  Run this AFTER admin.sql. Safe to run more than once.
--
--  Lets a signed-in admin manage the allow-list from /admin/admins
--  without ever needing the service_role key in the browser.
-- ============================================================

-- ============================================================
--  1. Allow-list access for admins
-- ============================================================
-- admin.sql already grants "read your own row". These add the rest so an
-- admin can see and manage the whole list.

drop policy if exists "Admins read admins" on public.admins;
create policy "Admins read admins"
  on public.admins for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins insert admins" on public.admins;
create policy "Admins insert admins"
  on public.admins for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins delete admins" on public.admins;
create policy "Admins delete admins"
  on public.admins for delete
  to authenticated
  using (public.is_admin());

-- ============================================================
--  2. Never let the allow-list empty out
-- ============================================================
-- Without this, removing the final admin locks everyone out of /admin
-- permanently, and the only fix is manual SQL.
create or replace function public.prevent_last_admin_removal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.admins) <= 1 then
    raise exception 'Cannot remove the last administrator.';
  end if;
  return old;
end;
$$;

revoke all on function public.prevent_last_admin_removal() from public;

drop trigger if exists prevent_last_admin_removal on public.admins;
create trigger prevent_last_admin_removal
  before delete on public.admins
  for each row execute function public.prevent_last_admin_removal();

-- ============================================================
--  3. List admins with their email
-- ============================================================
-- auth.users is not reachable through the API, so this runs as the definer
-- and returns only to callers who are already admins.
create or replace function public.list_admins()
returns table (
  user_id         uuid,
  email           text,
  added_at        timestamptz,
  last_sign_in_at timestamptz,
  is_self         boolean
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    a.user_id,
    u.email::text,
    a.created_at,
    u.last_sign_in_at,
    (a.user_id = auth.uid()) as is_self
  from public.admins a
  join auth.users u on u.id = a.user_id
  where public.is_admin()
  order by a.created_at;
$$;

revoke all on function public.list_admins() from public;
grant execute on function public.list_admins() to authenticated;

-- ============================================================
--  4. Grant admin by email
-- ============================================================
-- Resolves an email to a user id and adds it to the allow-list.
-- Returns 'granted' or 'no_user' so the UI can explain what happened.
create or replace function public.admin_grant_by_email(target_email text)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Not authorised';
  end if;

  select u.id into target_id
  from auth.users u
  where lower(u.email) = lower(trim(target_email))
  limit 1;

  if target_id is null then
    return 'no_user';
  end if;

  insert into public.admins (user_id) values (target_id)
  on conflict (user_id) do nothing;

  return 'granted';
end;
$$;

revoke all on function public.admin_grant_by_email(text) from public;
grant execute on function public.admin_grant_by_email(text) to authenticated;

-- ============================================================
--  Reminder: granting yourself the first time
--  Until at least one row exists in public.admins, nobody can use these
--  functions. Run this once with your own email:
-- ============================================================
-- insert into public.admins (user_id)
-- select id from auth.users where lower(email) = lower('you@example.com')
-- on conflict (user_id) do nothing;
