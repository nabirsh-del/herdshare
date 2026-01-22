import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { logEvent } from '@/lib/event-log';
import Stripe from 'stripe';

// Disable body parsing - we need raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = await verifyWebhookSignature(body, signature);
  } catch (error) {
    const err = error as Error;
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const allocationIntentId = session.metadata?.allocationIntentId;

  if (!allocationIntentId) {
    console.error('No allocationIntentId in session metadata');
    return;
  }

  const allocation = await prisma.allocationIntent.findUnique({
    where: { id: allocationIntentId },
  });

  if (!allocation) {
    console.error(`AllocationIntent not found: ${allocationIntentId}`);
    return;
  }

  // Update allocation status to PAID
  await prisma.allocationIntent.update({
    where: { id: allocationIntentId },
    data: {
      status: 'PAID',
      stripePaymentIntentId: session.payment_intent as string,
    },
  });

  // Log the event
  await logEvent({
    entityType: 'AllocationIntent',
    entityId: allocationIntentId,
    eventName: 'payment_received',
    eventPayload: {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      amountTotal: session.amount_total,
      previousStatus: allocation.status,
      newStatus: 'PAID',
    },
    allocationIntentId,
  });

  console.log(`AllocationIntent ${allocationIntentId} marked as PAID`);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const allocationIntentId = session.metadata?.allocationIntentId;

  if (!allocationIntentId) {
    return;
  }

  const allocation = await prisma.allocationIntent.findUnique({
    where: { id: allocationIntentId },
  });

  if (!allocation || allocation.status !== 'CHECKOUT_STARTED') {
    return;
  }

  // Revert to DRAFT status
  await prisma.allocationIntent.update({
    where: { id: allocationIntentId },
    data: {
      status: 'DRAFT',
      stripeCheckoutSessionId: null,
    },
  });

  await logEvent({
    entityType: 'AllocationIntent',
    entityId: allocationIntentId,
    eventName: 'checkout_expired',
    eventPayload: {
      stripeSessionId: session.id,
      previousStatus: 'CHECKOUT_STARTED',
      newStatus: 'DRAFT',
    },
    allocationIntentId,
  });

  console.log(`AllocationIntent ${allocationIntentId} checkout expired, reverted to DRAFT`);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Find allocation by payment intent ID
  const allocation = await prisma.allocationIntent.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!allocation) {
    console.log(`No allocation found for PaymentIntent: ${paymentIntent.id}`);
    return;
  }

  // Already handled by checkout.session.completed
  if (allocation.status === 'PAID') {
    return;
  }

  await prisma.allocationIntent.update({
    where: { id: allocation.id },
    data: { status: 'PAID' },
  });

  await logEvent({
    entityType: 'AllocationIntent',
    entityId: allocation.id,
    eventName: 'payment_intent_succeeded',
    eventPayload: {
      stripePaymentIntentId: paymentIntent.id,
      previousStatus: allocation.status,
      newStatus: 'PAID',
    },
    allocationIntentId: allocation.id,
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const allocation = await prisma.allocationIntent.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!allocation) {
    return;
  }

  await logEvent({
    entityType: 'AllocationIntent',
    entityId: allocation.id,
    eventName: 'payment_failed',
    eventPayload: {
      stripePaymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message,
    },
    allocationIntentId: allocation.id,
  });

  console.error(`Payment failed for allocation ${allocation.id}`);
}
