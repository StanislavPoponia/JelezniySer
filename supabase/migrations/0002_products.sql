-- Каталог товарів і сховище фото. Потребує 0001_profiles.sql (функція is_admin).

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  article     text not null,
  category    text not null,
  name_en     text,        -- переклад назви (необов'язково)
  category_en text,        -- переклад категорії (необов'язково)
  image_path  text,        -- шлях файлу у сховищі product-images
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- Дивитися товари може будь-хто.
drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products
  for select using (true);

-- Додавати, змінювати й видаляти може лише адмін.
drop policy if exists "products_insert_admin" on public.products;
create policy "products_insert_admin" on public.products
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "products_update_admin" on public.products;
create policy "products_update_admin" on public.products
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products_delete_admin" on public.products;
create policy "products_delete_admin" on public.products
  for delete to authenticated
  using (public.is_admin());

-- Сховище фото. Бакет публічний, тож фото відкриваються за прямим посиланням;
-- переглядати список файлів і змінювати їх може лише адмін.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_select_admin" on storage.objects;
create policy "product_images_select_admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_insert_admin" on storage.objects;
create policy "product_images_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_update_admin" on storage.objects;
create policy "product_images_update_admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_delete_admin" on storage.objects;
create policy "product_images_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
