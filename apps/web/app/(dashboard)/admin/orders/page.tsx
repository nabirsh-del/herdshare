'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDate, formatDateTime, getStatusColor, getProductPlanLabel } from '@/lib/utils';
import {
  Package,
  Search,
  Filter,
  Download,
  ChevronDown,
  Loader2,
  RefreshCw,
} from 'lucide-react';

type Order = {
  id: string;
  status: string;
  productPlan: string;
  createdAt: string;
  targetDeliveryWindowStart: string;
  targetDeliveryWindowEnd: string;
  estimatedHangingWeightLbs: number | null;
  pricingSnapshot: { total?: number; estimatedWeightLbs?: number } | null;
  buyer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  shippingAddress: {
    city?: string;
    state?: string;
    zip?: string;
  } | null;
};

type StatusUpdate = {
  orderId: string;
  status: string;
};

const STATUS_OPTIONS = [
  'PAID',
  'SCHEDULED',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders
        fetchOrders();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  }

  function exportCSV() {
    const headers = [
      'Order ID',
      'Status',
      'Product Plan',
      'Customer Email',
      'Customer Name',
      'Delivery Window',
      'Weight (lbs)',
      'Total',
      'City',
      'State',
      'ZIP',
      'Created',
    ];

    const rows = orders.map((o) => [
      o.id,
      o.status,
      o.productPlan,
      o.buyer.email,
      `${o.buyer.firstName || ''} ${o.buyer.lastName || ''}`.trim(),
      `${formatDate(o.targetDeliveryWindowStart)} - ${formatDate(o.targetDeliveryWindowEnd)}`,
      o.pricingSnapshot?.estimatedWeightLbs || '',
      o.pricingSnapshot?.total ? (o.pricingSnapshot.total / 100).toFixed(2) : '',
      o.shippingAddress?.city || '',
      o.shippingAddress?.state || '',
      o.shippingAddress?.zip || '',
      formatDateTime(o.createdAt),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `herdshare-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(query) ||
      o.buyer.email.toLowerCase().includes(query) ||
      `${o.buyer.firstName || ''} ${o.buyer.lastName || ''}`.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track all allocation orders</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchOrders} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {statusFilter
                ? `No orders with status "${statusFilter}"`
                : 'Orders will appear here once buyers place them'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Window
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.buyer.firstName} {order.buyer.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{order.buyer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getProductPlanLabel(order.productPlan).split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        ~{order.pricingSnapshot?.estimatedWeightLbs || '?'} lbs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.targetDeliveryWindowStart)}
                      </div>
                      <div className="text-xs text-gray-500">
                        to {formatDate(order.targetDeliveryWindowEnd)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.shippingAddress
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.state}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.pricingSnapshot?.total
                        ? formatCurrency(order.pricingSnapshot.total)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {updating === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateStatus(order.id, e.target.value);
                            }
                          }}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Update...</option>
                          {STATUS_OPTIONS.filter((s) => s !== order.status).map((status) => (
                            <option key={status} value={status}>
                              → {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
