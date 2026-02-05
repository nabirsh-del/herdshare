import { getOrCreateUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { UserRole } from '@herdshare/db';
import { Settings, DollarSign, Truck, MapPin } from 'lucide-react';

export default async function AdminSettingsPage() {
  const user = await getOrCreateUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect('/unauthorized');
  }

  const [pricingConfigs, geoClusters] = await Promise.all([
    prisma.pricingConfig.findMany({
      orderBy: { productPlan: 'asc' },
    }),
    prisma.geoCluster.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage pricing and delivery configurations</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Pricing Configuration */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Pricing Configuration</h2>
          </div>
          <div className="p-6">
            {pricingConfigs.length === 0 ? (
              <p className="text-gray-500">No pricing configurations found. Using defaults.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Base Price/lb</th>
                      <th className="pb-3 font-medium">Processing Fee/lb</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingConfigs.map((config) => (
                      <tr key={config.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{config.productPlan}</td>
                        <td className="py-3">${(config.basePricePerLb / 100).toFixed(2)}</td>
                        <td className="py-3">${(config.processingFeePerLb / 100).toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              config.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {config.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Geo Clusters */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Delivery Zones</h2>
          </div>
          <div className="p-6">
            {geoClusters.length === 0 ? (
              <p className="text-gray-500">No delivery zones configured.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 font-medium">ZIP Prefix</th>
                      <th className="pb-3 font-medium">Region</th>
                      <th className="pb-3 font-medium">Density</th>
                      <th className="pb-3 font-medium">Surcharge/lb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoClusters.map((cluster) => (
                      <tr key={cluster.id} className="border-b last:border-0">
                        <td className="py-3 font-mono">{cluster.zipPrefixes.join(', ')}</td>
                        <td className="py-3">{cluster.region}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              cluster.densityTier === 'HIGH'
                                ? 'bg-green-100 text-green-700'
                                : cluster.densityTier === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {cluster.densityTier}
                          </span>
                        </td>
                        <td className="py-3">${(cluster.surchargePerLb / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
