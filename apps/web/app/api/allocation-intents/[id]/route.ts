import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UserRole } from '@herdshare/db';

// GET /api/allocation-intents/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const allocation = await prisma.allocationIntent.findUnique({
      where: { id: params.id },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        complianceCheckpoints: {
          orderBy: { timestamp: 'desc' },
        },
        fulfillmentRoute: true,
      },
    });

    if (!allocation) {
      return NextResponse.json(
        { error: 'Allocation intent not found' },
        { status: 404 }
      );
    }

    // Only the buyer or admin/rancher can view
    if (
      allocation.buyerId !== user.id &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.RANCHER
    ) {
      return NextResponse.json(
        { error: 'Not authorized to view this allocation' },
        { status: 403 }
      );
    }

    return NextResponse.json(allocation);
  } catch (error) {
    console.error('Error fetching allocation intent:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch allocation intent' },
      { status: 500 }
    );
  }
}
