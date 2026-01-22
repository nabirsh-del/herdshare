import { ProductPlan, DensityTier } from '@herdshare/db';
import { prisma } from './db';

export type PricingSnapshot = {
  basePricePerLb: number; // cents
  processingFeePerLb: number; // cents
  logisticsSurchargePerLb: number; // cents
  estimatedWeightLbs: number;
  subtotal: number; // cents
  processingTotal: number; // cents
  logisticsTotal: number; // cents
  taxRate: number; // percentage
  taxAmount: number; // cents
  total: number; // cents
  stripeFeeEstimate: number; // cents (for admin visibility only)
  createdAt: string;
};

// Default pricing if not configured in DB
const DEFAULT_PRICING: Record<ProductPlan, { basePricePerLb: number; processingFeePerLb: number }> = {
  WHOLE: { basePricePerLb: 650, processingFeePerLb: 125 },
  HALF: { basePricePerLb: 700, processingFeePerLb: 125 },
  QUARTER: { basePricePerLb: 750, processingFeePerLb: 125 },
  CUSTOM: { basePricePerLb: 800, processingFeePerLb: 150 },
};

// Logistics surcharges by density tier (cents per lb)
const LOGISTICS_SURCHARGES: Record<DensityTier, number> = {
  HIGH: 25, // High density areas = lower surcharge
  MEDIUM: 50,
  LOW: 75,
};

// Estimated weights by product plan
const ESTIMATED_WEIGHTS: Record<ProductPlan, number> = {
  WHOLE: 450,
  HALF: 225,
  QUARTER: 112,
  CUSTOM: 100,
};

// Get pricing config from database or defaults
async function getPricingConfig(productPlan: ProductPlan) {
  const config = await prisma.pricingConfig.findFirst({
    where: {
      productPlan,
      active: true,
      effectiveFrom: { lte: new Date() },
      OR: [{ effectiveUntil: null }, { effectiveUntil: { gte: new Date() } }],
    },
    orderBy: { effectiveFrom: 'desc' },
  });

  if (config) {
    return {
      basePricePerLb: Number(config.basePricePerLb),
      processingFeePerLb: Number(config.processingFeePerLb),
    };
  }

  return DEFAULT_PRICING[productPlan];
}

// Get logistics surcharge based on geo cluster
async function getLogisticsSurcharge(zipCode?: string): Promise<{ surchargePerLb: number; densityTier: DensityTier }> {
  if (!zipCode) {
    return { surchargePerLb: LOGISTICS_SURCHARGES.MEDIUM, densityTier: 'MEDIUM' };
  }

  // Get first 3 digits of ZIP for matching
  const zipPrefix = zipCode.substring(0, 3);

  const cluster = await prisma.geoCluster.findFirst({
    where: {
      active: true,
      zipPrefixes: { has: zipPrefix },
    },
  });

  if (cluster) {
    return {
      surchargePerLb: Number(cluster.surchargePerLb),
      densityTier: cluster.densityTier,
    };
  }

  // Default to medium tier
  return { surchargePerLb: LOGISTICS_SURCHARGES.MEDIUM, densityTier: 'MEDIUM' };
}

// Calculate full pricing snapshot
export async function calculatePricing(
  productPlan: ProductPlan,
  estimatedWeightLbs?: number,
  zipCode?: string,
  taxRate: number = 0 // percentage (e.g., 8.5 for 8.5%)
): Promise<PricingSnapshot> {
  const pricing = await getPricingConfig(productPlan);
  const logistics = await getLogisticsSurcharge(zipCode);

  const weight = estimatedWeightLbs || ESTIMATED_WEIGHTS[productPlan];

  // Calculate totals
  const subtotal = pricing.basePricePerLb * weight;
  const processingTotal = pricing.processingFeePerLb * weight;
  const logisticsTotal = logistics.surchargePerLb * weight;

  const preTaxTotal = subtotal + processingTotal + logisticsTotal;
  const taxAmount = Math.round(preTaxTotal * (taxRate / 100));
  const total = preTaxTotal + taxAmount;

  // Stripe fee estimate (2.9% + 30 cents) - for admin visibility
  const stripeFeeEstimate = Math.round(total * 0.029 + 30);

  return {
    basePricePerLb: pricing.basePricePerLb,
    processingFeePerLb: pricing.processingFeePerLb,
    logisticsSurchargePerLb: logistics.surchargePerLb,
    estimatedWeightLbs: weight,
    subtotal,
    processingTotal,
    logisticsTotal,
    taxRate,
    taxAmount,
    total,
    stripeFeeEstimate,
    createdAt: new Date().toISOString(),
  };
}

// Format pricing for display
export function formatPricingBreakdown(snapshot: PricingSnapshot): string[] {
  const lines: string[] = [];

  lines.push(`Base price: $${(snapshot.basePricePerLb / 100).toFixed(2)}/lb × ${snapshot.estimatedWeightLbs} lbs = $${(snapshot.subtotal / 100).toFixed(2)}`);
  lines.push(`Processing: $${(snapshot.processingFeePerLb / 100).toFixed(2)}/lb × ${snapshot.estimatedWeightLbs} lbs = $${(snapshot.processingTotal / 100).toFixed(2)}`);
  lines.push(`Delivery: $${(snapshot.logisticsSurchargePerLb / 100).toFixed(2)}/lb × ${snapshot.estimatedWeightLbs} lbs = $${(snapshot.logisticsTotal / 100).toFixed(2)}`);

  if (snapshot.taxAmount > 0) {
    lines.push(`Tax (${snapshot.taxRate}%): $${(snapshot.taxAmount / 100).toFixed(2)}`);
  }

  lines.push(`Total: $${(snapshot.total / 100).toFixed(2)}`);

  return lines;
}
