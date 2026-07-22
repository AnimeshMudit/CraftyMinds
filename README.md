# Crafty Mind Studio

A premium Next.js e-commerce storefront for handcrafted arts (MDF Arts, Pouches, Magnets, and Rakhis). Built with Next.js, Tailwind CSS, Supabase, and Razorpay.

## Features
- **Storefront**: Premium, dynamic catalog filtering and product detail views.
- **Cart & Checkout**: Real-time persistent shopping cart supporting guest and logged-in checkouts.
- **Razorpay Integration**: Seamless payment flows with support for payment recovery, retries, and automatic failed-order cleanup.
- **Secure Authentication**: Consolidated Supabase auth synchronization with server cookies, protecting admin and customer dashboards.
- **Guest Order Linking**: Automatically links historical guest orders with newly created/logged-in customer accounts sharing the same email address.

---

## Environment Variables

To run this application locally or in production, configure the following environment variables in your `.env.local` or hosting provider:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=            # Your public Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # Your public Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=           # Supabase service role key (keep secret, server-only)

# Authentication Secrets
ADMIN_PASSWORD=                      # Password for the admin dashboard session encryption
CUSTOMER_SESSION_SECRET=             # 64-character hex string for signing customer cookies

# Razorpay Integration
NEXT_PUBLIC_RAZORPAY_KEY_ID=         # Public Razorpay key ID
RAZORPAY_KEY_ID=                     # Secret Razorpay key ID
RAZORPAY_KEY_SECRET=                 # Razorpay key secret (keep secret, server-only)

# Email Notifications
RESEND_API_KEY=                      # Resend service API key
FROM_EMAIL=                          # Source email for transactional updates (e.g., craftymindstudio@gmail.com)
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## Production Deployment Checklist
1. Configure all required environment variables in your hosting provider (e.g., Vercel, Netlify).
2. Configure Razorpay webhooks pointing to your production host `/api/payment/verify` endpoint.
3. Keep database indexes up-to-date in Supabase (specifically `orders(user_id)` and `orders(email)`).
