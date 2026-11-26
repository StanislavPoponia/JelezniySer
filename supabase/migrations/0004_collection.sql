-- «Моя колекція»: фото й відео робіт. Потребує 0001_profiles.sql (функція is_admin).

create table if not exists public.collection_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  media_path  text not null,   -- шлях файлу у сховищі collection-media
  media_type  text not null check (media_type in ('image', 'video')),
  created_at  timestamptz not null default now()
);

alter table public.collection_items enable row level security;

revoke all on public.collection_items from anon, authenticated;
grant select on public.collection_items to anon, authenticated;
grant insert, update, delete on public.collection_items to authenticated;

drop policy if exists "collection_read" on public.collection_items;
create policy "collection_read" on public.collection_items
  for select using (true);

drop policy if exists "collection_insert_admin" on public.collection_items;
create policy "collection_insert_admin" on public.collection_items
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "collection_update_admin" on public.collection_items;
create policy "collection_update_admin" on public.collection_items
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "collection_delete_admin" on public.collection_items;
create policy "collection_delete_admin" on public.collection_items
  for delete to authenticated
  using (public.is_admin());

-- Публічний бакет з обмеженням розміру (50 МБ) і типів файлів.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'collection-media', 'collection-media', true, 52428800,
  array['image/webp', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

drop policy if exists "collection_media_select_admin" on storage.objects;
create policy "collection_media_select_admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'collection-media' and public.is_admin());

drop policy if exists "collection_media_insert_admin" on storage.objects;
create policy "collection_media_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'collection-media' and public.is_admin());

drop policy if exists "collection_media_delete_admin" on storage.objects;
create policy "collection_media_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'collection-media' and public.is_admin());
