import { getOrCreateUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@herdshare/db';
import { formatCurrency, formatDate, getStatusColor, getProductPlanLabel } from '@/lib/utils';
import { Package, ArrowRight, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Redirect admin/finance to admin dashboard
  if (user.role === UserRole.ADMIN || user.role === UserRole.FINANCE) {
    redirect('/admin/orders');
  }

  // Redirect rancher to rancher dashboard
  if (user.role === UserRole.RANCHER) {
    redirect('/rancher');
  }

  // Buyer dashboard
  const orders = await prisma.allocationIntent.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const activeOrders = orders.filter((o) =>
    ['PAID', 'SCHEDULED', 'PROCESSING', 'SHIPPED'].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName || 'there'}!
          </h1>
          <p className="text-gray-600">Here's an overview of your beef reservations</p>
        </div>
        <Link href="/reserve" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Reservation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Active Orders</div>
          <div className="text-3xl font-bold text-gray-900">{activeOrders.length}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Completed Orders</div>
          <div className="text-3xl font-bold text-gray-900">{completedOrders.length}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Total Spent</div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(
              completedOrders.reduce((sum, o) => {
                const pricing = o.pricingSnapshot as { total?: number } | null;
                return sum + (pricing?.total || 0);
              }, 0)
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Your Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              Ready to reserve your first beef share? Get started now.
            </p>
            <Link href="/reserve" className="btn-primary inline-flex items-center gap-2">
              Reserve Your First Share <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => {
              const pricing = order.pricingSnapshot as {
                total?: number;
                estimatedWeightLbs?: number;
              } | null;

              return (
                <div
                  key={order.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getProductPlanLabel(order.productPlan)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Delivery:{' '}
                        {formatDate(order.targetDeliveryWindowStart)} -{' '}
                        {formatDate(order.targetDeliveryWindowEnd)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-medium">
                        {pricing?.total ? formatCurrency(pricing.total) : 'Pending'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ~{pricing?.estimatedWeightLbs || '?'} lbs
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
