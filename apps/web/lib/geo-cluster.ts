import { DensityTier } from '@herdshare/db';
import { prisma } from './db';

export type GeoClusterInfo = {
  id: string;
  name: string;
  region: string;
  densityTier: DensityTier;
  surchargePerLb: number;
};

// Find geo cluster by ZIP code
export async function findClusterByZip(zipCode: string): Promise<GeoClusterInfo | null> {
  const zipPrefix = zipCode.substring(0, 3);

  const cluster = await prisma.geoCluster.findFirst({
    where: {
      active: true,
      zipPrefixes: { has: zipPrefix },
    },
  });

  if (!cluster) {
    return null;
  }

  return {
    id: cluster.id,
    name: cluster.name,
    region: cluster.region,
    densityTier: cluster.densityTier,
    surchargePerLb: Number(cluster.surchargePerLb),
  };
}

// Get or create fulfillment route for a region/cluster
export async function getOrCreateFulfillmentRoute(
  region: string,
  geoClusterId: string,
  plannedDeliveryDate: Date
): Promise<string> {
  // Look for existing route in the same cluster with the same planned date
  const existingRoute = await prisma.fulfillmentRoute.findFirst({
    where: {
      geoClusterId,
      active: true,
      plannedDropDates: { has: plannedDeliveryDate },
    },
  });

  if (existingRoute) {
    return existingRoute.id;
  }

  // Create new route
  const newRoute = await prisma.fulfillmentRoute.create({
    data: {
      region,
      geoClusterId,
      plannedDropDates: [plannedDeliveryDate],
      aggregatedVolumeLbs: 0,
    },
  });

  return newRoute.id;
}

// Update aggregated volume for a route
export async function updateRouteVolume(routeId: string, additionalLbs: number) {
  await prisma.fulfillmentRoute.update({
    where: { id: routeId },
    data: {
      aggregatedVolumeLbs: { increment: additionalLbs },
    },
  });
}

// Calculate route density score based on volume and area
export async function calculateRouteDensity(routeId: string): Promise<number> {
  const route = await prisma.fulfillmentRoute.findUnique({
    where: { id: routeId },
    include: {
      allocationIntents: {
        where: {
          status: { in: ['PAID', 'SCHEDULED', 'PROCESSING'] },
        },
      },
    },
  });

  if (!route) return 0;

  const orderCount = route.allocationIntents.length;
  const volume = Number(route.aggregatedVolumeLbs);

  // Simple density score: orders per 100 lbs, scaled to 0-100
  const densityScore = Math.min(100, (orderCount / Math.max(volume / 100, 1)) * 20);

  await prisma.fulfillmentRoute.update({
    where: { id: routeId },
    data: { routeDensityScore: densityScore },
  });

  return densityScore;
}

// Get available delivery windows for a region
export function getAvailableDeliveryWindows(
  startDate: Date = new Date(),
  weeks: number = 8
): Array<{ start: Date; end: Date; label: string }> {
  const windows: Array<{ start: Date; end: Date; label: string }> = [];

  // Start from next week
  const current = new Date(startDate);
  current.setDate(current.getDate() + (7 - current.getDay()) + 1); // Next Monday

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(current);
    weekStart.setDate(current.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const label = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    windows.push({ start: weekStart, end: weekEnd, label });
  }

  return windows;
}
