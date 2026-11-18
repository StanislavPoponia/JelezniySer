-- Профілі користувачів + ролі. Виконати в Supabase → SQL Editor.

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'user' check (role in ('user', 'admin')),
  full_name  text,
  phone      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Перевірка адміна. security definer, щоб політики не зациклювались на profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Автоматично створювати профіль (роль user) при реєстрації.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Політики: свій профіль бачить і міняє власник, адмін бачить усі.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Користувач може міняти тільки ім'я й телефон, але не role.
revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
