# HerdShare Security Documentation

## Overview

This document outlines the security measures implemented in HerdShare and provides a checklist for security review.

## Authentication

### Clerk Integration
- All authentication handled by Clerk
- Session management via Clerk
- No passwords stored in application database
- Magic link support for passwordless auth

### Session Security
- HTTP-only cookies
- Secure flag in production
- SameSite cookie policy
- Session expiration configured in Clerk

## Authorization (RBAC)

### Roles
| Role | Level | Access |
|------|-------|--------|
| ADMIN | 4 | Full system access |
| FINANCE | 3 | Read access to orders, metrics |
| RANCHER | 2 | Own assignments, demand data |
| BUYER | 1 | Own orders only |

### Enforcement Points

1. **Middleware** (`middleware.ts`)
   - Route-level access control
   - Redirects unauthorized access

2. **API Routes**
   - `requireAuth()` validates authentication
   - Role checks on sensitive endpoints

3. **Database Queries**
   - User ID filtering on data access
   - No cross-user data leakage

### Example Implementation
```typescript
// Route protection
export async function GET(request: NextRequest) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.FINANCE]);
  // Only ADMIN and FINANCE can proceed
}
```

## Stripe Security

### Webhook Verification
```typescript
export async function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
```

### Security Measures
- Signature verification on all webhooks
- Raw body parsing (not JSON) for verification
- Webhook secret stored in environment variable
- HTTPS only for webhook endpoints

### Sensitive Data Handling
- No card numbers stored
- Payment intent IDs only for reference
- Checkout session IDs for tracking

## Environment Variables

### Required Secrets
```
CLERK_SECRET_KEY          # Clerk API secret
STRIPE_SECRET_KEY         # Stripe API secret
STRIPE_WEBHOOK_SECRET     # Webhook verification
DATABASE_URL              # Database connection
```

### Client-Safe Variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
```

### Security Rules
- Never log secrets
- Never expose in client code
- Rotate regularly
- Use different keys for dev/prod

## Input Validation

### Zod Schemas
All API inputs validated with Zod:

```typescript
const createAllocationSchema = z.object({
  productPlan: z.enum(['WHOLE', 'HALF', 'QUARTER', 'CUSTOM']),
  targetDeliveryWindowStart: z.string().transform((s) => new Date(s)),
  // ... strict typing
});
```

### Validation Points
- API route handlers
- Form submissions
- Query parameters
- Webhook payloads

## Database Security

### Prisma ORM
- Parameterized queries (SQL injection prevention)
- Type-safe queries
- No raw SQL in application code

### Connection Security
- SSL required in production
- Connection string in environment variable
- Connection pooling for performance

### Data Access Patterns
```typescript
// Always filter by user ID for user data
const orders = await prisma.allocationIntent.findMany({
  where: { buyerId: user.id },
});
```

## API Security

### Rate Limiting
Consider implementing:
- Per-user rate limits
- Per-endpoint limits
- Exponential backoff

### CORS
- Configured via Next.js
- Restrict to known origins in production

### Error Handling
- No stack traces in production
- Generic error messages to clients
- Detailed logging server-side

## Audit Logging

### EventLog Implementation
All significant actions logged:
```typescript
await logEvent({
  actorRole: user.role,
  actorId: user.id,
  entityType: 'AllocationIntent',
  entityId: allocation.id,
  eventName: 'status_changed',
  eventPayload: { previousStatus, newStatus },
});
```

### Logged Events
- Order creation
- Status changes
- Payment events
- Compliance checkpoints
- Admin actions

### Log Retention
- Immutable records
- No deletion API
- Consider archival strategy

## Security Checklist

### Development
- [ ] No secrets in code
- [ ] No secrets in git history
- [ ] Development keys separate from production
- [ ] .env files in .gitignore

### Authentication
- [ ] All routes protected appropriately
- [ ] Role checks on API endpoints
- [ ] Session timeout configured
- [ ] Logout clears all session data

### API Security
- [ ] Input validation on all endpoints
- [ ] Output sanitization
- [ ] Error messages don't leak info
- [ ] Rate limiting considered

### Database
- [ ] SQL injection prevented (Prisma)
- [ ] User data isolation enforced
- [ ] Sensitive data encrypted at rest
- [ ] Backups encrypted

### Stripe
- [ ] Webhook signature verification
- [ ] HTTPS only
- [ ] No card data stored
- [ ] Live mode keys secured

### Infrastructure
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies audited
- [ ] Monitoring in place

## Incident Response

### If Secrets Exposed
1. Rotate immediately
2. Review access logs
3. Update all environments
4. Notify affected parties

### If Data Breach
1. Assess scope
2. Contain breach
3. Notify users if required
4. Document and improve

## Compliance Considerations

### PCI DSS
- No card data stored
- Stripe handles PCI compliance
- Secure webhook handling

### Food Safety
- Compliance checkpoints logged
- Evidence URLs for documentation
- Audit trail maintained
