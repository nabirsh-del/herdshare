# HerdShare Architecture

## System Overview

HerdShare is a three-sided marketplace connecting:
1. **Buyers** - Reserve beef capacity
2. **Ranchers** - Supply beef inventory
3. **Operators** - Coordinate processing and logistics

## Core Domain Objects

### 1. AllocationIntent (→ Stripe PaymentIntent)

The central order object that tracks a buyer's beef reservation through its lifecycle.

```
States: DRAFT → CHECKOUT_STARTED → PAID → SCHEDULED → PROCESSING → SHIPPED → COMPLETED
                                     ↓
                                 CANCELED
```

Key fields:
- Product plan (whole/half/quarter/custom)
- Delivery window
- Pricing snapshot (frozen at checkout)
- Stripe integration IDs
- Fulfillment assignments

### 2. CapacityReservation (→ Stripe Subscriptions)

Recurring reservations for buyers who want regular deliveries.

### 3. FulfillmentRoute (→ Payment Routing)

Groups orders by geography for efficient delivery:
- Geo cluster assignment
- Route density scoring
- Processor/carrier assignments

### 4. RancherCommitment (→ Merchant Tools)

Tracks rancher's committed supply:
- Rolling 90-day volume
- Available head count
- Processing slot availability

### 5. ComplianceCheckpoint (→ Fraud/Compliance)

Cold-chain verification points:
- Temperature readings at each handoff
- Seal integrity checks
- Document uploads

### 6. EventLog (Audit Trail)

Immutable record of all system events:
- Actor identification (who)
- Entity changes (what)
- Timestamps (when)
- Payload snapshots

## Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Buyer     │────▶│ AllocationIntent │────▶│ Stripe Checkout │
└─────────────┘     └──────────────┘     └─────────────────┘
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │ Pricing      │     │ Webhook Handler │
                    │ Snapshot     │     └─────────────────┘
                    └──────────────┘              │
                           │                      │
                           ▼                      ▼
                    ┌──────────────┐     ┌─────────────────┐
                    │ FulfillmentRoute│◀───│ Status: PAID    │
                    │ Assignment   │     └─────────────────┘
                    └──────────────┘
                           │
                           ▼
┌─────────────┐     ┌──────────────┐
│   Rancher   │◀────│ Assignment   │
└─────────────┘     │ Notification │
       │            └──────────────┘
       │
       ▼
┌─────────────────┐
│ Compliance      │
│ Checkpoints     │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Delivery        │
│ COMPLETED       │
└─────────────────┘
```

## Geo-Clustering Algorithm

### Overview
Orders are grouped by ZIP code prefix for efficient routing.

### Process
1. Extract 3-digit ZIP prefix from shipping address
2. Match to GeoCluster record
3. Determine density tier (HIGH/MEDIUM/LOW)
4. Calculate logistics surcharge
5. Assign to FulfillmentRoute

### Density Tiers

| Tier | Description | Surcharge/lb |
|------|-------------|--------------|
| HIGH | Metro areas, high order density | $0.25 |
| MEDIUM | Suburban areas | $0.50 |
| LOW | Rural areas | $0.75 |

## Pricing Model

### Components
1. **Base Price** - Per pound, varies by plan (whole/half/quarter)
2. **Processing Fee** - USDA processing cost per pound
3. **Logistics Surcharge** - Delivery cost based on density tier

### Snapshot Mechanism
Pricing is calculated and frozen at checkout time:
- Never recomputed after payment
- Stored as JSON in AllocationIntent
- Includes all breakdowns for transparency

```typescript
type PricingSnapshot = {
  basePricePerLb: number;
  processingFeePerLb: number;
  logisticsSurchargePerLb: number;
  estimatedWeightLbs: number;
  subtotal: number;
  processingTotal: number;
  logisticsTotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  stripeFeeEstimate: number; // Admin visibility only
  createdAt: string;
};
```

## Authentication & Authorization

### Clerk Integration
- Manages user authentication
- Syncs to local User table
- Role stored in Clerk public metadata

### RBAC Implementation

```
Middleware (middleware.ts)
    │
    ├── Public routes: Allow
    │
    └── Protected routes
         │
         ├── /admin/* → Requires ADMIN role
         ├── /rancher/* → Requires ADMIN or RANCHER
         ├── /finance/* → Requires ADMIN or FINANCE
         └── /dashboard/* → Any authenticated user
```

### API Route Protection
Each API route validates:
1. Authentication (via `requireAuth()`)
2. Authorization (via role check)

## Event Logging

All significant actions are logged to EventLog:

```typescript
await logEvent({
  actorRole: user.role,
  actorId: user.id,
  entityType: 'AllocationIntent',
  entityId: allocation.id,
  eventName: 'status_changed',
  eventPayload: {
    previousStatus: 'PAID',
    newStatus: 'SCHEDULED',
    notes: 'Assigned to Q1 delivery route'
  },
  allocationIntentId: allocation.id,
});
```

Events are immutable and queryable for:
- Audit trails
- Debugging
- Analytics

## Database Indexing Strategy

### AllocationIntent
- `status` - Filter by order status
- `buyerId` - User's orders lookup
- `createdAt` - Time-based queries
- `targetDeliveryWindowStart/End` - Delivery scheduling
- `stripeCheckoutSessionId` - Webhook processing

### FulfillmentRoute
- `region` - Geographic filtering
- `geoClusterId` - Cluster grouping
- `active` - Only active routes

### EventLog
- `entityType, entityId` - Entity history lookup
- `actorId` - User activity audit
- `createdAt` - Time-based queries

## Error Handling

### API Responses
```typescript
// Success
return NextResponse.json(data, { status: 200 });

// Validation Error
return NextResponse.json(
  { error: 'Validation failed', details: zodError.errors },
  { status: 400 }
);

// Auth Error
return NextResponse.json(
  { error: 'Unauthorized' },
  { status: 401 }
);

// Not Found
return NextResponse.json(
  { error: 'Resource not found' },
  { status: 404 }
);

// Server Error
return NextResponse.json(
  { error: 'Internal server error' },
  { status: 500 }
);
```

### Webhook Error Handling
- Signature verification failure → 400
- Missing metadata → Log and skip
- Processing errors → 500 (Stripe will retry)

## Performance Considerations

### Database
- Connection pooling via Prisma
- Indexed queries for common operations
- Pagination on list endpoints

### API
- Edge-ready API routes
- Minimal data fetching (select specific fields)
- Parallel data fetching where possible

### Frontend
- Server components by default
- Client components only when needed
- Optimistic UI updates
