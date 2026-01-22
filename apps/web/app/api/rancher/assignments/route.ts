import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UserRole } from '@herdshare/db';

// GET /api/rancher/assignments - Get rancher's assigned orders and demand
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth([UserRole.ADMIN, UserRole.RANCHER]);

    // Get rancher's region
    const rancherUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { region: true },
    });

    const region = rancherUser?.region;

    // Get assigned orders (orders assigned to this rancher)
    const assignedOrders = await prisma.allocationIntent.findMany({
      where: {
        assignedRancherId: user.id,
        status: { in: ['PAID', 'SCHEDULED', 'PROCESSING'] },
      },
      orderBy: { targetDeliveryWindowStart: 'asc' },
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
          take: 3,
        },
      },
    });

    // Get rolling 90-day demand for the region
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    // Aggregate demand by product plan
    const demandByPlan = await prisma.allocationIntent.groupBy({
      by: ['productPlan'],
      where: {
        status: { in: ['PAID', 'SCHEDULED', 'PROCESSING'] },
        targetDeliveryWindowStart: {
          gte: new Date(),
          lte: ninetyDaysFromNow,
        },
        // If rancher has a region, filter by it via fulfillment route
        ...(region
          ? {
              fulfillmentRoute: {
                region,
              },
            }
          : {}),
      },
      _count: { id: true },
      _sum: { estimatedHangingWeightLbs: true },
    });

    // Get rancher's commitments
    const commitments = await prisma.rancherCommitment.findMany({
      where: {
        rancherId: user.id,
        periodEnd: { gte: new Date() },
      },
      orderBy: { periodStart: 'asc' },
    });

    // Weekly breakdown of upcoming orders
    const weeklyDemand = await getWeeklyDemand(region);

    return NextResponse.json({
      assignedOrders,
      demand: {
        byPlan: demandByPlan.map((d) => ({
          productPlan: d.productPlan,
          orderCount: d._count.id,
          totalWeightLbs: d._sum.estimatedHangingWeightLbs
            ? Number(d._sum.estimatedHangingWeightLbs)
            : 0,
        })),
        weekly: weeklyDemand,
      },
      commitments,
    });
  } catch (error) {
    console.error('Error fetching rancher assignments:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

async function getWeeklyDemand(region?: string | null) {
  const weeks: Array<{
    weekStart: Date;
    weekEnd: Date;
    orderCount: number;
    totalWeightLbs: number;
  }> = [];

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const orders = await prisma.allocationIntent.findMany({
      where: {
        status: { in: ['PAID', 'SCHEDULED', 'PROCESSING'] },
        targetDeliveryWindowStart: { gte: weekStart, lte: weekEnd },
        ...(region
          ? {
              fulfillmentRoute: {
                region,
              },
            }
          : {}),
      },
      select: {
        estimatedHangingWeightLbs: true,
      },
    });

    weeks.push({
      weekStart,
      weekEnd,
      orderCount: orders.length,
      totalWeightLbs: orders.reduce(
        (sum, o) => sum + (o.estimatedHangingWeightLbs ? Number(o.estimatedHangingWeightLbs) : 0),
        0
      ),
    });
  }

  return weeks;
}
