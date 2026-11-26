-- Докладний опис товару (необов'язковий).

alter table public.products add column if not exists description text;
