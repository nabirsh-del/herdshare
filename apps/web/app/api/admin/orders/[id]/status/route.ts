import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { logEvent } from '@/lib/event-log';
import { AllocationStatus, UserRole } from '@herdshare/db';

const updateStatusSchema = z.object({
  status: z.enum([
    'DRAFT',
    'CHECKOUT_STARTED',
    'PAID',
    'SCHEDULED',
    'PROCESSING',
    'SHIPPED',
    'COMPLETED',
    'CANCELED',
  ]),
  notes: z.string().optional(),
  assignedProcessorId: z.string().optional(),
  fulfillmentRouteId: z.string().optional(),
});

// Valid status transitions
const validTransitions: Record<AllocationStatus, AllocationStatus[]> = {
  DRAFT: ['CHECKOUT_STARTED', 'CANCELED'],
  CHECKOUT_STARTED: ['PAID', 'DRAFT', 'CANCELED'],
  PAID: ['SCHEDULED', 'CANCELED'],
  SCHEDULED: ['PROCESSING', 'PAID', 'CANCELED'],
  PROCESSING: ['SHIPPED', 'SCHEDULED', 'CANCELED'],
  SHIPPED: ['COMPLETED', 'PROCESSING'],
  COMPLETED: [], // Terminal state
  CANCELED: [], // Terminal state
};

// PATCH /api/admin/orders/:id/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth([UserRole.ADMIN]);

    const body = await request.json();
    const { status, notes, assignedProcessorId, fulfillmentRouteId } =
      updateStatusSchema.parse(body);

    // Get current allocation
    const allocation = await prisma.allocationIntent.findUnique({
      where: { id: params.id },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: 'Allocation not found' },
        { status: 404 }
      );
    }

    // Validate status transition
    const allowedTransitions = validTransitions[allocation.status];
    if (!allowedTransitions.includes(status as AllocationStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${allocation.status} to ${status}`,
          allowedTransitions,
        },
        { status: 400 }
      );
    }

    // Update the allocation
    const updateData: Record<string, unknown> = { status };

    if (assignedProcessorId !== undefined) {
      updateData.assignedProcessorId = assignedProcessorId;
    }

    if (fulfillmentRouteId !== undefined) {
      updateData.fulfillmentRouteId = fulfillmentRouteId;
    }

    if (status === 'COMPLETED') {
      updateData.deliveredAt = new Date();
    }

    const updated = await prisma.allocationIntent.update({
      where: { id: params.id },
      data: updateData,
    });

    // Log the status change
    await logEvent({
      actorRole: user.role,
      actorId: user.id,
      entityType: 'AllocationIntent',
      entityId: params.id,
      eventName: 'status_changed',
      eventPayload: {
        previousStatus: allocation.status,
        newStatus: status,
        notes,
        assignedProcessorId,
        fulfillmentRouteId,
      },
      allocationIntentId: params.id,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order status:', error);

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
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
