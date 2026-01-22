# HerdShare

**Planning Infrastructure for Beef** - A production-grade platform connecting buyers with ranchers for bulk beef reservations.

## Overview

HerdShare is a full-stack application that enables:
- **Buyers** to reserve beef capacity (whole/half/quarter shares) with transparent pricing
- **Ranchers** to view demand, manage commitments, and fulfill orders
- **Admins** to coordinate processing, logistics, and compliance

Built with the Stripe-to-HerdShare mapping:
- Payment rails → Beef supply chain backbone
- Payment gateways → Processing + logistics partners
- Fraud + compliance → Food safety + cold chain compliance
- APIs → Allocation contracts + order/commitment primitives

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Auth**: Clerk (email/password + magic link)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe Checkout + Webhooks
- **Hosting**: Vercel / Cloudflare Pages

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon/Supabase recommended)
- Stripe account (test mode)
- Clerk account

### 1. Clone and Install

```bash
cd herdshare
npm install
```

### 2. Environment Setup

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Stripe Webhook Testing

### Local Development

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the webhook signing secret to your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Test Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Project Structure

```
herdshare/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router pages
│       │   ├── (auth)/         # Auth pages (sign-in, sign-up)
│       │   ├── (dashboard)/    # Protected dashboard pages
│       │   │   ├── admin/      # Admin pages
│       │   │   └── rancher/    # Rancher pages
│       │   ├── api/            # API routes
│       │   ├── checkout/       # Checkout flow pages
│       │   └── reserve/        # Reservation flow
│       ├── components/         # React components
│       └── lib/                # Utilities and helpers
├── packages/
│   └── db/                     # Database package
│       ├── prisma/             # Prisma schema and migrations
│       └── src/                # Database client export
└── docs/                       # Documentation
```

## API Endpoints

### Buyer APIs
- `POST /api/allocation-intents` - Create draft allocation
- `GET /api/allocation-intents` - List user's allocations
- `GET /api/allocation-intents/:id` - Get allocation details
- `POST /api/checkout/create-session` - Start Stripe checkout

### Admin APIs
- `GET /api/admin/orders` - List all orders (RBAC protected)
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/metrics/summary` - KPI dashboard data

### Rancher APIs
- `GET /api/rancher/assignments` - View assigned orders and demand

### Compliance APIs
- `POST /api/compliance/checkpoints` - Record checkpoint
- `GET /api/compliance/checkpoints` - List checkpoints

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## User Roles (RBAC)

| Role | Access |
|------|--------|
| BUYER | Create reservations, view own orders |
| RANCHER | View demand, assigned orders, manage commitments |
| ADMIN | Full access to all features |
| FINANCE | View orders, metrics (read-only) |

Set user roles in Clerk Dashboard → Users → [User] → Public Metadata:
```json
{
  "role": "ADMIN"
}
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Cloudflare Pages

1. Build the project: `npm run build`
2. Deploy the `.next` output to Cloudflare Pages
3. Configure environment variables

### Webhook Configuration

For production, update your Stripe webhook endpoint:
```
https://your-domain.com/api/webhooks/stripe
```

Enable these events:
- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Security Checklist

- [x] RBAC enforcement on all protected routes
- [x] Stripe webhook signature verification
- [x] No secrets in client-side code
- [x] Environment variables for all sensitive config
- [x] HTTPS only in production
- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma parameterized queries)

## MVP Scope Guardrails

### Included in MVP
- Buyer reservation flow with Stripe checkout
- Admin order management dashboard
- Rancher demand visibility
- Basic geo-clustering and pricing
- Cold-chain compliance checkpoints
- Event audit logging

### Deferred (Future)
- Owned warehouse inventory management
- Advanced demand forecasting/ML
- Automated rancher payouts (Stripe Connect)
- Real-time delivery tracking
- Mobile app
- Multi-tenant white-label support
- Custom cut sheet builder UI
- SMS/push notifications
- Advanced reporting/analytics
- Inventory reservation holds

## License

Private - All rights reserved
