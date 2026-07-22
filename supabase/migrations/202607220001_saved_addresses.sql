-- Saved delivery addresses support for Crafty Minds

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  phone text not null,
  house_flat text not null,
  street text not null,
  landmark text,
  city text not null,
  state text not null,
  pin_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Addresses are readable by owner'
  ) then
    create policy "Addresses are readable by owner"
      on public.addresses
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Addresses are insertable by owner'
  ) then
    create policy "Addresses are insertable by owner"
      on public.addresses
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Addresses are updatable by owner'
  ) then
    create policy "Addresses are updatable by owner"
      on public.addresses
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Addresses are deletable by owner'
  ) then
    create policy "Addresses are deletable by owner"
      on public.addresses
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
before update on public.addresses
for each row
execute function public.set_updated_at();
