# HerdShare Deployment Guide

## Prerequisites

- Production database (Neon, Supabase, or managed PostgreSQL)
- Stripe production account
- Clerk production instance
- Domain name

## Option 1: Vercel Deployment (Recommended)

### 1. Connect Repository

1. Go to https://vercel.com
2. Import your GitHub repository
3. Select the `apps/web` directory as root

### 2. Configure Build Settings

```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3. Set Environment Variables

Add all production environment variables:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Deploy

Click "Deploy" and wait for build to complete.

### 5. Configure Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

## Option 2: Cloudflare Pages

### 1. Build Configuration

```yaml
# Build settings
Build command: npm run build
Build output directory: apps/web/.next
Root directory: /
```

### 2. Environment Variables

Set all production environment variables in Cloudflare Dashboard.

### 3. Deploy

Connect your GitHub repository and deploy.

## Post-Deployment Steps

### 1. Database Migration

Run migrations against production database:

```bash
DATABASE_URL="your-production-url" npx prisma db push
```

### 2. Seed Production Data

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

### 3. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy signing secret and update environment variable

### 4. Update Clerk Settings

1. Go to Clerk Dashboard
2. Update production instance URLs
3. Configure allowed origins

### 5. Configure Admin Users

1. Create your admin account
2. In Clerk Dashboard, set role metadata:
```json
{
  "role": "ADMIN"
}
```

## Security Checklist

### Environment Variables
- [ ] All secrets in environment variables
- [ ] No secrets in client-side code (check NEXT_PUBLIC_ prefixes)
- [ ] Separate production and development keys

### Authentication
- [ ] Clerk production instance configured
- [ ] Redirect URLs set correctly
- [ ] Session security settings reviewed

### Payments
- [ ] Stripe live mode keys configured
- [ ] Webhook secret updated
- [ ] Webhook endpoint verified
- [ ] Test transaction completed

### Database
- [ ] SSL enabled for database connection
- [ ] Connection pooling configured
- [ ] Backup strategy in place

### Application
- [ ] HTTPS enforced
- [ ] CORS configured if needed
- [ ] Rate limiting considered

## Monitoring

### Error Tracking (Sentry)

1. Create Sentry project
2. Add environment variables:
```
SENTRY_DSN=https://...
```

### Logs

- Vercel: Logs available in Vercel Dashboard
- Cloudflare: Workers logs in Cloudflare Dashboard

### Uptime Monitoring

Consider setting up:
- Uptime Robot
- Better Uptime
- Pingdom

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer, Prisma Data Proxy)
- Consider read replicas for heavy read loads
- Monitor query performance

### Application
- Vercel/Cloudflare handle auto-scaling
- Consider edge caching for static content
- Implement API rate limiting

### Stripe
- Monitor webhook delivery
- Implement idempotency for critical operations
- Consider webhook queue for high volume

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Database
1. Identify breaking migration
2. Create rollback migration
3. Deploy rollback

## Maintenance Mode

To enable maintenance mode:

1. Create `app/maintenance/page.tsx`
2. Update middleware to redirect all traffic
3. Deploy
4. Revert when maintenance complete
