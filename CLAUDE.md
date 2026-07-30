# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Crafty Mind Studio — a Next.js (App Router) e-commerce storefront for handcrafted arts (MDF Arts, Pouches, Magnets, Rakhis). Stack: Next.js 15 / React 19, Tailwind CSS 4, Supabase (Postgres + Auth + Storage), Razorpay payments, Resend transactional email.

## Commands

```bash
npm run dev      # start dev server (Turbopack), http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # run production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

There is no test suite/framework configured in this repo. `tsconfig.tsbuildinfo` is a generated incremental-build artifact — never edit it by hand.

Path alias: `@/*` maps to the repo root (`tsconfig.json`).

## Architecture

### Two independent auth systems

There are **two separate, non-overlapping session mechanisms** — do not mix them up:

1. **Admin auth** (`lib/auth/session.ts`): a custom HMAC-signed cookie (`admin_session`), keyed off `ADMIN_PASSWORD`, checked/refreshed in `middleware.ts` for every `/admin/*` route except `/admin/login`. Not related to Supabase Auth.
2. **Customer auth** (`lib/auth/customer-session.ts` + `lib/auth/customer-session-server.ts`): a separate HMAC-signed cookie (`customer_session`, secret `CUSTOMER_SESSION_SECRET`) that wraps a Supabase access/refresh token pair. `middleware.ts` protects `/checkout`, `/profile`, `/my-orders`, `/order-confirmation`, and transparently refreshes expired sessions via `supabase.auth.refreshSession`. There is also a plain Supabase SSR cookie session (`lib/supabase/server.ts` → `createServerUserClient`) refreshed on every request for use by `app/auth/callback` (OAuth) — the customer session cookie is the thing route handlers/pages actually read to identify the logged-in customer.

`middleware.ts` matcher only runs on `/admin/:path*`, `/profile/:path*`, `/my-orders/:path*`, `/checkout/:path*`, `/order-confirmation/:path*` — routes outside that list get no auth/session refresh at all.

### Supabase client variants (`lib/supabase/`)

- `client.ts` — browser client (anon key), for client components.
- `server.ts` — `createServerSupabaseClient()` uses the **service role key** (bypasses RLS; server-only, never expose to the client) for admin/product/order mutations; `createServerUserClient()` uses the anon key + cookies for user-scoped/RLS-respecting server reads (used with the customer session flow).
- `products.ts` / `products-server.ts` — client-side vs server-side product data access (server versions used in Server Components and API routes; also handle Supabase Storage upload/delete for the `product-images` bucket).
- `orders-server.ts` — order queries; every read of orders first calls `expire-orders.ts`'s `expirePendingOrders()` as a lazy sweep (transitions `pending` orders older than 30 min to `expired`, deletes abandoned `failed`/`expired` orders older than 24h — there is no cron; cleanup piggybacks on normal reads).

### Payment flow (Razorpay)

1. `app/api/orders/route.ts` creates an `orders` row with `payment_status: "pending"`.
2. `app/api/payment/create-order/route.ts` creates the matching Razorpay order (amount in paise).
3. Client completes checkout via Razorpay; `app/api/payment/verify/route.ts` verifies the HMAC signature (`RAZORPAY_KEY_SECRET`, timing-safe compare) and updates the order to `payment_status: "paid"` — the update is scoped with `.in("payment_status", ["pending","failed","expired"])` so it can't silently overwrite an already-paid order. On success it triggers `lib/email/resend.ts`'s `sendOrderEmails`; email failures must not fail the payment response.
4. Guest checkout is supported — orders link back to a customer by matching `email` (see README's "Guest Order Linking"), not solely by `user_id`.

### Cart

`context/CartContext.tsx` is a client-only cart backed by `localStorage` (`craftyminds_cart`), synced across tabs via the `storage` event — there is no server-side cart. Quantities are clamped to 1–99.

### Products

`types/product.ts` defines `category` as a closed union: `"mdf" | "pouch" | "magnet" | "rakhis"`. The `mdf`/`pouches`/`magnets`/`rakhis` routes under `app/` are per-category storefront pages driven by this field. `specifications` is stored as JSON in Supabase and normalized to an array by `parseProduct()` in `products-server.ts`/`products.ts` — always go through those helpers rather than querying `products` directly, since raw rows may have `specifications` as a string.

### Admin area

`app/admin/*` (products CRUD, orders, analytics) sits behind the admin cookie described above. `app/admin/analytics` + `app/api/admin/analytics/route.ts` is the internal analytics module (distinct from the Vercel Web Analytics integration used site-wide).

### Environment variables

See `README.md` for the full list (Supabase URL/anon/service-role keys, `ADMIN_PASSWORD`, `CUSTOMER_SESSION_SECRET`, Razorpay key id/secret pairs — note there's a public and a secret Razorpay key id, both used, don't confuse them — and Resend email config). Local values live in `.env.local` (gitignored).

### Database

Supabase migrations live in `supabase/migrations/` (plain SQL, timestamp-prefixed filenames, applied manually — there's no migration-runner script in `package.json`). Keep `orders(user_id)` and `orders(email)` indexed (per README's production checklist) since order lookups filter on both.
