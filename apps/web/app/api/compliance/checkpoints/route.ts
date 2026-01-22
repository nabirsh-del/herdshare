import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { logEvent } from '@/lib/event-log';
import { UserRole } from '@herdshare/db';

const createCheckpointSchema = z.object({
  allocationIntentId: z.string(),
  checkpointType: z.enum([
    'TEMP_AT_PICKUP',
    'TEMP_AT_HANDOFF',
    'TEMP_AT_DELIVERY',
    'SEAL_INTACT',
    'DOC_UPLOADED',
  ]),
  measuredValue: z.string().optional(),
  unit: z.string().optional(),
  timestamp: z.string().transform((s) => new Date(s)),
  evidenceUrl: z.string().url().optional(),
  passFail: z.enum(['PASS', 'FAIL', 'PENDING']).default('PENDING'),
  notes: z.string().optional(),
});

// POST /api/compliance/checkpoints - Create a new checkpoint
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth([UserRole.ADMIN, UserRole.RANCHER]);

    const body = await request.json();
    const data = createCheckpointSchema.parse(body);

    // Verify allocation exists
    const allocation = await prisma.allocationIntent.findUnique({
      where: { id: data.allocationIntentId },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: 'Allocation not found' },
        { status: 404 }
      );
    }

    // Create the checkpoint
    const checkpoint = await prisma.complianceCheckpoint.create({
      data: {
        allocationIntentId: data.allocationIntentId,
        checkpointType: data.checkpointType,
        measuredValue: data.measuredValue,
        unit: data.unit,
        timestamp: data.timestamp,
        evidenceUrl: data.evidenceUrl,
        passFail: data.passFail,
        notes: data.notes,
        recordedById: user.id,
      },
    });

    // Log the event
    await logEvent({
      actorRole: user.role,
      actorId: user.id,
      entityType: 'ComplianceCheckpoint',
      entityId: checkpoint.id,
      eventName: 'checkpoint_created',
      eventPayload: {
        checkpointType: data.checkpointType,
        passFail: data.passFail,
        measuredValue: data.measuredValue,
        unit: data.unit,
      },
      allocationIntentId: data.allocationIntentId,
    });

    return NextResponse.json(checkpoint, { status: 201 });
  } catch (error) {
    console.error('Error creating checkpoint:', error);

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
      { error: 'Failed to create checkpoint' },
      { status: 500 }
    );
  }
}

// GET /api/compliance/checkpoints - Get checkpoints for an allocation
export async function GET(request: NextRequest) {
  try {
    await requireAuth([UserRole.ADMIN, UserRole.RANCHER, UserRole.FINANCE]);

    const { searchParams } = new URL(request.url);
    const allocationIntentId = searchParams.get('allocationIntentId');

    if (!allocationIntentId) {
      return NextResponse.json(
        { error: 'allocationIntentId is required' },
        { status: 400 }
      );
    }

    const checkpoints = await prisma.complianceCheckpoint.findMany({
      where: { allocationIntentId },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json(checkpoints);
  } catch (error) {
    console.error('Error fetching checkpoints:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch checkpoints' },
      { status: 500 }
    );
  }
}
