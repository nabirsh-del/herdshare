import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { logEvent } from '@/lib/event-log';
import { calculatePricing } from '@/lib/pricing';
import { ProductPlan, Prisma } from '@herdshare/db';

// Validation schema for creating allocation intent
const createAllocationSchema = z.object({
  productPlan: z.enum(['WHOLE', 'HALF', 'QUARTER', 'CUSTOM']),
  targetDeliveryWindowStart: z.string().transform((s) => new Date(s)),
  targetDeliveryWindowEnd: z.string().transform((s) => new Date(s)),
  estimatedHangingWeightLbs: z.number().optional(),
  cutsPreferences: z.record(z.string()).optional(),
  storageCapacityConfirmed: z.boolean().default(false),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    instructions: z.string().optional(),
  }).optional(),
});

// POST /api/allocation-intents - Create a new draft allocation intent
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = createAllocationSchema.parse(body);

    // Calculate pricing snapshot
    const zipCode = data.shippingAddress?.zip;
    const pricingSnapshot = await calculatePricing(
      data.productPlan as ProductPlan,
      data.estimatedHangingWeightLbs,
      zipCode
    );

    // Create the allocation intent
    const allocationIntent = await prisma.allocationIntent.create({
      data: {
        buyerId: user.id,
        productPlan: data.productPlan,
        targetDeliveryWindowStart: data.targetDeliveryWindowStart,
        targetDeliveryWindowEnd: data.targetDeliveryWindowEnd,
        estimatedHangingWeightLbs: data.estimatedHangingWeightLbs,
        estimatedBoxedWeightLbs: data.estimatedHangingWeightLbs
          ? data.estimatedHangingWeightLbs * 0.6 // ~60% yield
          : null,
        cutsPreferences: data.cutsPreferences as Prisma.InputJsonValue | undefined,
        storageCapacityConfirmed: data.storageCapacityConfirmed,
        shippingAddress: data.shippingAddress as Prisma.InputJsonValue | undefined,
        pricingSnapshot,
        status: 'DRAFT',
      },
    });

    // Log the event
    await logEvent({
      actorRole: user.role,
      actorId: user.id,
      entityType: 'AllocationIntent',
      entityId: allocationIntent.id,
      eventName: 'allocation_created',
      eventPayload: {
        productPlan: data.productPlan,
        status: 'DRAFT',
      },
      allocationIntentId: allocationIntent.id,
    });

    return NextResponse.json(allocationIntent, { status: 201 });
  } catch (error) {
    console.error('Error creating allocation intent:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to create allocation intent' },
      { status: 500 }
    );
  }
}

// GET /api/allocation-intents - Get user's allocation intents
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = { buyerId: user.id };
    if (status) {
      where.status = status;
    }

    const allocations = await prisma.allocationIntent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        complianceCheckpoints: true,
      },
    });

    return NextResponse.json(allocations);
  } catch (error) {
    console.error('Error fetching allocation intents:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch allocation intents' },
      { status: 500 }
    );
  }
}
