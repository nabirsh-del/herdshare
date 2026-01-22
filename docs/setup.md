# HerdShare Setup Guide

## Prerequisites

- Node.js 18 or later
- npm 10 or later
- PostgreSQL database
- Stripe account
- Clerk account

## Step 1: Database Setup

### Option A: Neon (Recommended for development)

1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string

### Option B: Supabase

1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the URI (use "Transaction pooler" for serverless)

### Option C: Local PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql
createdb herdshare

# Connection string
DATABASE_URL="postgresql://localhost:5432/herdshare"
```

## Step 2: Clerk Setup

1. Create account at https://clerk.com
2. Create a new application
3. Configure authentication:
   - Enable Email/Password
   - Enable Magic Links (optional)
4. Get your API keys from Dashboard → API Keys
5. Configure URLs in Dashboard → Paths:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding`

### Setting User Roles

In Clerk Dashboard:
1. Go to Users
2. Select a user
3. Scroll to "Public metadata"
4. Add: `{"role": "ADMIN"}` (or BUYER, RANCHER, FINANCE)

## Step 3: Stripe Setup

1. Create account at https://stripe.com
2. Enable Test Mode
3. Get API keys from Developers → API keys:
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

### Webhook Setup (Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login:
```bash
stripe login
```

3. Forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret (whsec_...)

### Webhook Setup (Production)

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the signing secret

## Step 4: Environment Configuration

Create `.env.local` in `apps/web/`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Step 5: Install Dependencies

```bash
cd herdshare
npm install
```

## Step 6: Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

## Step 7: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 8: Test the Flow

1. **Sign up** as a new user
2. In Clerk Dashboard, set your role to ADMIN
3. **Create a reservation**:
   - Click "Reserve Supply"
   - Select a plan
   - Fill in delivery details
   - Proceed to checkout
4. **Complete payment** with test card: `4242 4242 4242 4242`
5. **View order** in Admin Dashboard

## Troubleshooting

### Database connection issues

```bash
# Test connection
npx prisma db pull

# If using SSL, ensure sslmode=require in connection string
```

### Clerk authentication issues

- Verify publishable key matches environment
- Check redirect URLs in Clerk dashboard
- Ensure cookies are enabled in browser

### Stripe webhook issues

- Verify webhook secret is correct
- Check Stripe CLI is forwarding correctly
- View webhook logs in Stripe Dashboard

### Prisma issues

```bash
# Regenerate client
npm run db:generate

# Reset database (CAUTION: deletes all data)
npx prisma db push --force-reset
```

## Production Deployment

See [deployment.md](./deployment.md) for production deployment instructions.
