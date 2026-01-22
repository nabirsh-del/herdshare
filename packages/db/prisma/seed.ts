import { PrismaClient, UserRole, ProductPlan, DensityTier, AllocationStatus, CommitmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create geo clusters for different regions
  const clusters = await Promise.all([
    prisma.geoCluster.upsert({
      where: { id: 'cluster-denver' },
      update: {},
      create: {
        id: 'cluster-denver',
        name: 'Denver Metro',
        region: 'colorado',
        zipPrefixes: ['800', '801', '802', '803', '804', '805'],
        centerLat: 39.7392,
        centerLng: -104.9903,
        radiusMiles: 50,
        densityTier: DensityTier.HIGH,
        surchargePerLb: 0.25,
      },
    }),
    prisma.geoCluster.upsert({
      where: { id: 'cluster-boulder' },
      update: {},
      create: {
        id: 'cluster-boulder',
        name: 'Boulder Area',
        region: 'colorado',
        zipPrefixes: ['803'],
        centerLat: 40.015,
        centerLng: -105.2705,
        radiusMiles: 30,
        densityTier: DensityTier.HIGH,
        surchargePerLb: 0.30,
      },
    }),
    prisma.geoCluster.upsert({
      where: { id: 'cluster-rural-co' },
      update: {},
      create: {
        id: 'cluster-rural-co',
        name: 'Rural Colorado',
        region: 'colorado',
        zipPrefixes: ['806', '807', '808', '809', '810', '811', '812', '813', '814', '815', '816'],
        centerLat: 39.5501,
        centerLng: -105.7821,
        radiusMiles: 100,
        densityTier: DensityTier.LOW,
        surchargePerLb: 0.75,
      },
    }),
    prisma.geoCluster.upsert({
      where: { id: 'cluster-kansas-city' },
      update: {},
      create: {
        id: 'cluster-kansas-city',
        name: 'Kansas City Metro',
        region: 'kansas',
        zipPrefixes: ['660', '661', '662', '664', '665', '666'],
        centerLat: 39.0997,
        centerLng: -94.5786,
        radiusMiles: 60,
        densityTier: DensityTier.MEDIUM,
        surchargePerLb: 0.50,
      },
    }),
  ]);

  console.log(`Created ${clusters.length} geo clusters`);

  // Create pricing configs
  const pricingConfigs = await Promise.all([
    prisma.pricingConfig.upsert({
      where: { productPlan: ProductPlan.WHOLE },
      update: {},
      create: {
        productPlan: ProductPlan.WHOLE,
        basePricePerLb: 6.50,
        processingFeePerLb: 1.25,
        minWeightLbs: 350,
        maxWeightLbs: 550,
      },
    }),
    prisma.pricingConfig.upsert({
      where: { productPlan: ProductPlan.HALF },
      update: {},
      create: {
        productPlan: ProductPlan.HALF,
        basePricePerLb: 7.00,
        processingFeePerLb: 1.25,
        minWeightLbs: 175,
        maxWeightLbs: 275,
      },
    }),
    prisma.pricingConfig.upsert({
      where: { productPlan: ProductPlan.QUARTER },
      update: {},
      create: {
        productPlan: ProductPlan.QUARTER,
        basePricePerLb: 7.50,
        processingFeePerLb: 1.25,
        minWeightLbs: 90,
        maxWeightLbs: 140,
      },
    }),
    prisma.pricingConfig.upsert({
      where: { productPlan: ProductPlan.CUSTOM },
      update: {},
      create: {
        productPlan: ProductPlan.CUSTOM,
        basePricePerLb: 8.00,
        processingFeePerLb: 1.50,
        minWeightLbs: 25,
        maxWeightLbs: 600,
      },
    }),
  ]);

  console.log(`Created ${pricingConfigs.length} pricing configs`);

  // Create processor partners
  const processors = await Promise.all([
    prisma.processorPartner.upsert({
      where: { id: 'processor-1' },
      update: {},
      create: {
        id: 'processor-1',
        name: 'Mountain View Processing',
        region: 'colorado',
        address: {
          street: '1234 Processing Way',
          city: 'Fort Collins',
          state: 'CO',
          zip: '80521',
        },
        contactEmail: 'contact@mvprocessing.example.com',
        contactPhone: '970-555-0100',
        usdaNumber: 'EST 12345',
        capacityPerWeek: 25,
      },
    }),
    prisma.processorPartner.upsert({
      where: { id: 'processor-2' },
      update: {},
      create: {
        id: 'processor-2',
        name: 'Prairie Meats USDA',
        region: 'kansas',
        address: {
          street: '5678 Butcher Blvd',
          city: 'Topeka',
          state: 'KS',
          zip: '66601',
        },
        contactEmail: 'info@prairiemeats.example.com',
        contactPhone: '785-555-0200',
        usdaNumber: 'EST 67890',
        capacityPerWeek: 40,
      },
    }),
  ]);

  console.log(`Created ${processors.length} processor partners`);

  // Create carrier partners
  const carriers = await Promise.all([
    prisma.carrierPartner.upsert({
      where: { id: 'carrier-1' },
      update: {},
      create: {
        id: 'carrier-1',
        name: 'Cold Chain Logistics',
        regions: ['colorado', 'kansas', 'nebraska'],
        contactEmail: 'dispatch@coldchain.example.com',
        contactPhone: '800-555-0300',
        coldChainCert: true,
      },
    }),
    prisma.carrierPartner.upsert({
      where: { id: 'carrier-2' },
      update: {},
      create: {
        id: 'carrier-2',
        name: 'Regional Refrigerated Transport',
        regions: ['colorado'],
        contactEmail: 'ops@rrt.example.com',
        contactPhone: '303-555-0400',
        coldChainCert: true,
      },
    }),
  ]);

  console.log(`Created ${carriers.length} carrier partners`);

  // Create fulfillment routes
  const nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + (8 - nextMonday.getDay()));
  nextMonday.setHours(0, 0, 0, 0);

  const routes = await Promise.all([
    prisma.fulfillmentRoute.upsert({
      where: { id: 'route-denver-1' },
      update: {},
      create: {
        id: 'route-denver-1',
        region: 'colorado',
        geoClusterId: 'cluster-denver',
        plannedDropDates: [nextMonday, new Date(nextMonday.getTime() + 7 * 24 * 60 * 60 * 1000)],
        aggregatedVolumeLbs: 0,
        assignedProcessorId: 'processor-1',
        assignedCarrierId: 'carrier-1',
        routeDensityScore: 85,
        logisticsSurchargePerLb: 0.25,
      },
    }),
    prisma.fulfillmentRoute.upsert({
      where: { id: 'route-kc-1' },
      update: {},
      create: {
        id: 'route-kc-1',
        region: 'kansas',
        geoClusterId: 'cluster-kansas-city',
        plannedDropDates: [nextMonday],
        aggregatedVolumeLbs: 0,
        assignedProcessorId: 'processor-2',
        assignedCarrierId: 'carrier-1',
        routeDensityScore: 70,
        logisticsSurchargePerLb: 0.50,
      },
    }),
  ]);

  console.log(`Created ${routes.length} fulfillment routes`);

  console.log('Seed completed successfully!');
  console.log('\nNote: User data is managed through Clerk authentication.');
  console.log('To create test users, use the Clerk dashboard or sign up through the app.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
