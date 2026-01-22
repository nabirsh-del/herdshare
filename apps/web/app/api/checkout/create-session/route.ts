import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { requireAuth } from '@/lib/auth';
import { logEvent } from '@/lib/event-log';
import { getProductPlanLabel } from '@/lib/utils';

const createSessionSchema = z.object({
  allocationIntentId: z.string(),
});

// POST /api/checkout/create-session
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { allocationIntentId } = createSessionSchema.parse(body);

    // Get the allocation intent
    const allocation = await prisma.allocationIntent.findUnique({
      where: { id: allocationIntentId },
      include: {
        buyer: true,
      },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: 'Allocation intent not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (allocation.buyerId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Verify status
    if (allocation.status !== 'DRAFT' && allocation.status !== 'CHECKOUT_STARTED') {
      return NextResponse.json(
        { error: 'Allocation is not in a valid state for checkout' },
        { status: 400 }
      );
    }

    // Get pricing from snapshot
    const pricing = allocation.pricingSnapshot as {
      total: number;
      estimatedWeightLbs: number;
      basePricePerLb: number;
      processingFeePerLb: number;
      logisticsSurchargePerLb: number;
    };

    if (!pricing || !pricing.total) {
      return NextResponse.json(
        { error: 'Pricing not calculated' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: allocationIntentId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${getProductPlanLabel(allocation.productPlan)} - HerdShare`,
              description: `Estimated ${pricing.estimatedWeightLbs} lbs of premium beef`,
              metadata: {
                allocationIntentId,
                productPlan: allocation.productPlan,
              },
            },
            unit_amount: pricing.total,
          },
          quantity: 1,
        },
      ],
      metadata: {
        allocationIntentId,
        buyerId: user.id,
        productPlan: allocation.productPlan,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?allocation_id=${allocationIntentId}`,
    });

    // Update allocation with checkout session ID
    await prisma.allocationIntent.update({
      where: { id: allocationIntentId },
      data: {
        stripeCheckoutSessionId: session.id,
        status: 'CHECKOUT_STARTED',
      },
    });

    // Log the event
    await logEvent({
      actorRole: user.role,
      actorId: user.id,
      entityType: 'AllocationIntent',
      entityId: allocationIntentId,
      eventName: 'checkout_started',
      eventPayload: {
        stripeSessionId: session.id,
        previousStatus: allocation.status,
        newStatus: 'CHECKOUT_STARTED',
      },
      allocationIntentId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);

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
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
