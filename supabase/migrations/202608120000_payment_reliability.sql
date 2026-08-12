-- Migration: Payment Reliability, Webhook Deduplication, and Email Idempotency
-- Application: Crafty Mind Studio

alter table public.orders
  add column if not exists payment_confirmation_sent_at timestamptz,
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_signature text;

create index if not exists orders_razorpay_order_id_idx on public.orders(razorpay_order_id);
create index if not exists orders_razorpay_payment_id_idx on public.orders(razorpay_payment_id);

create table if not exists public.webhook_events (
  id text primary key,
  event_type text not null,
  created_at timestamptz not null default now()
);

alter table public.webhook_events enable row level security;
