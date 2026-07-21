-- Clean up any existing duplicate order_numbers by appending a suffix (keeping the oldest one as is)
with duplicates as (
  select id,
         row_number() over (partition by order_number order by created_at asc) as rn
  from public.orders
)
update public.orders
set order_number = order_number || '-dup-' || (select rn from duplicates where duplicates.id = public.orders.id)
where id in (select id from duplicates where rn > 1);

-- Add unique constraint to the order_number column
alter table public.orders
  add constraint orders_order_number_unique unique (order_number);
