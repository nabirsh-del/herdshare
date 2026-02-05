import { getOrCreateUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { UserRole } from '@herdshare/db';
import { Users, Mail, MapPin, Package } from 'lucide-react';

export default async function AdminRanchersPage() {
  const user = await getOrCreateUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect('/unauthorized');
  }

  const ranchers = await prisma.user.findMany({
    where: { role: UserRole.RANCHER },
    include: {
      rancherCommitments: {
        where: {
          status: 'CONFIRMED',
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get assignments for each rancher separately
  const rancherIds = ranchers.map((r) => r.id);
  const assignments = await prisma.allocationIntent.findMany({
    where: {
      assignedRancherId: { in: rancherIds },
      status: { in: ['PAID', 'SCHEDULED', 'PROCESSING', 'SHIPPED'] },
    },
  });

  // Group assignments by rancher
  const assignmentsByRancher = assignments.reduce((acc, order) => {
    const rancherId = order.assignedRancherId!;
    if (!acc[rancherId]) acc[rancherId] = [];
    acc[rancherId].push(order);
    return acc;
  }, {} as Record<string, typeof assignments>);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ranchers</h1>
          <p className="text-gray-600">Manage rancher accounts and view their assignments</p>
        </div>
      </div>

      {ranchers.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ranchers yet</h3>
          <p className="text-gray-600">
            Ranchers will appear here once they sign up and are assigned the RANCHER role.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {ranchers.map((rancher) => (
            <div key={rancher.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {rancher.firstName} {rancher.lastName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {rancher.email}
                      </span>
                      {rancher.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {rancher.region}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(assignmentsByRancher[rancher.id] || []).length}
                    </div>
                    <div className="text-xs text-gray-500">Active Orders</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {rancher.rancherCommitments.length}
                    </div>
                    <div className="text-xs text-gray-500">Commitments</div>
                  </div>
                </div>
              </div>

              {(assignmentsByRancher[rancher.id] || []).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm font-medium text-gray-700 mb-2">Active Assignments</div>
                  <div className="flex flex-wrap gap-2">
                    {(assignmentsByRancher[rancher.id] || []).slice(0, 5).map((order) => (
                      <span
                        key={order.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        <Package className="w-3 h-3" />
                        {order.productPlan} - {order.status}
                      </span>
                    ))}
                    {(assignmentsByRancher[rancher.id] || []).length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{(assignmentsByRancher[rancher.id] || []).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
