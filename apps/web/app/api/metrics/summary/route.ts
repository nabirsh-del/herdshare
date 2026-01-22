import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { UserRole } from '@herdshare/db';

// GET /api/metrics/summary - Get KPI dashboard metrics
export async function GET(request: NextRequest) {
  try {
    await requireAuth([UserRole.ADMIN, UserRole.FINANCE]);

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date();

    // Get order counts by status
    const ordersByStatus = await prisma.allocationIntent.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
    });

    // Calculate on-time percentage
    const completedOrders = await prisma.allocationIntent.findMany({
      where: {
        status: 'COMPLETED',
        deliveredAt: { not: null },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        targetDeliveryWindowEnd: true,
        deliveredAt: true,
      },
    });

    const onTimeCount = completedOrders.filter(
      (o) => o.deliveredAt && o.deliveredAt <= o.targetDeliveryWindowEnd
    ).length;
    const onTimePercentage =
      completedOrders.length > 0
        ? Math.round((onTimeCount / completedOrders.length) * 100)
        : 0;

    // Revenue metrics
    const paidOrders = await prisma.allocationIntent.findMany({
      where: {
        status: { in: ['PAID', 'SCHEDULED', 'PROCESSING', 'SHIPPED', 'COMPLETED'] },
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        pricingSnapshot: true,
      },
    });

    const totalRevenue = paidOrders.reduce((sum, order) => {
      const pricing = order.pricingSnapshot as { total?: number } | null;
      return sum + (pricing?.total || 0);
    }, 0);

    const averageOrderValue =
      paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    // Volume metrics
    const volumeData = await prisma.allocationIntent.aggregate({
      where: {
        status: { in: ['PAID', 'SCHEDULED', 'PROCESSING', 'SHIPPED', 'COMPLETED'] },
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: {
        estimatedHangingWeightLbs: true,
        estimatedBoxedWeightLbs: true,
      },
    });

    // Orders by product plan
    const ordersByPlan = await prisma.allocationIntent.groupBy({
      by: ['productPlan'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
      _sum: { estimatedHangingWeightLbs: true },
    });

    // Compliance checkpoint summary
    const checkpointSummary = await prisma.complianceCheckpoint.groupBy({
      by: ['passFail'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
    });

    // Active routes
    const activeRoutes = await prisma.fulfillmentRoute.count({
      where: {
        active: true,
        aggregatedVolumeLbs: { gt: 0 },
      },
    });

    return NextResponse.json({
      period: {
        startDate,
        endDate,
      },
      orders: {
        byStatus: ordersByStatus.reduce(
          (acc, s) => ({ ...acc, [s.status]: s._count.id }),
          {}
        ),
        total: ordersByStatus.reduce((sum, s) => sum + s._count.id, 0),
        byPlan: ordersByPlan.map((p) => ({
          plan: p.productPlan,
          count: p._count.id,
          weightLbs: p._sum.estimatedHangingWeightLbs
            ? Number(p._sum.estimatedHangingWeightLbs)
            : 0,
        })),
      },
      revenue: {
        total: totalRevenue,
        averageOrderValue,
      },
      volume: {
        totalHangingWeightLbs: volumeData._sum.estimatedHangingWeightLbs
          ? Number(volumeData._sum.estimatedHangingWeightLbs)
          : 0,
        totalBoxedWeightLbs: volumeData._sum.estimatedBoxedWeightLbs
          ? Number(volumeData._sum.estimatedBoxedWeightLbs)
          : 0,
      },
      performance: {
        onTimePercentage,
        completedOrders: completedOrders.length,
      },
      compliance: {
        checkpoints: checkpointSummary.reduce(
          (acc, c) => ({ ...acc, [c.passFail]: c._count.id }),
          {}
        ),
      },
      logistics: {
        activeRoutes,
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);

    if (error instanceof Error && error.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
