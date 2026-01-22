import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UserRole } from '@herdshare/db';

// GET /api/admin/orders - Get all orders with filters
export async function GET(request: NextRequest) {
  try {
    await requireAuth([UserRole.ADMIN, UserRole.FINANCE]);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const region = searchParams.get('region');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.createdAt as Record<string, Date>).lte = new Date(endDate);
      }
    }

    // Get orders with buyer info
    const [orders, total] = await Promise.all([
      prisma.allocationIntent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          fulfillmentRoute: true,
          complianceCheckpoints: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
        },
      }),
      prisma.allocationIntent.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + orders.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
