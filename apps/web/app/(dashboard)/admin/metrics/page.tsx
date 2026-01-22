'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatWeight } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  Loader2,
  RefreshCw,
} from 'lucide-react';

type Metrics = {
  period: {
    startDate: string;
    endDate: string;
  };
  orders: {
    byStatus: Record<string, number>;
    total: number;
    byPlan: Array<{
      plan: string;
      count: number;
      weightLbs: number;
    }>;
  };
  revenue: {
    total: number;
    averageOrderValue: number;
  };
  volume: {
    totalHangingWeightLbs: number;
    totalBoxedWeightLbs: number;
  };
  performance: {
    onTimePercentage: number;
    completedOrders: number;
  };
  compliance: {
    checkpoints: Record<string, number>;
  };
  logistics: {
    activeRoutes: number;
  };
};

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      });

      const response = await fetch(`/api/metrics/summary?${params}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const statusCounts = metrics.orders.byStatus || {};
  const checkpointCounts = metrics.compliance.checkpoints || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metrics Dashboard</h1>
          <p className="text-gray-600">Key performance indicators and analytics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={fetchMetrics} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.revenue.total)}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        <MetricCard
          title="Total Orders"
          value={metrics.orders.total.toString()}
          icon={<Package className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <MetricCard
          title="On-Time Delivery"
          value={`${metrics.performance.onTimePercentage}%`}
          icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <MetricCard
          title="Active Routes"
          value={metrics.logistics.activeRoutes.toString()}
          icon={<Truck className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(metrics.revenue.averageOrderValue)}
          icon={<TrendingUp className="w-5 h-5 text-brand-600" />}
          iconBg="bg-brand-100"
        />
        <MetricCard
          title="Total Hanging Weight"
          value={formatWeight(metrics.volume.totalHangingWeightLbs)}
          icon={<BarChart3 className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
        />
        <MetricCard
          title="Completed Orders"
          value={metrics.performance.completedOrders.toString()}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders by Status */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Orders by Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status === 'COMPLETED'
                          ? 'bg-green-500'
                          : status === 'CANCELED'
                          ? 'bg-red-500'
                          : status === 'PAID'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    <span className="text-gray-700">{status}</span>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders by Plan */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Orders by Product Plan</h2>
          </div>
          <div className="p-6">
            {metrics.orders.byPlan.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data available</p>
            ) : (
              <div className="space-y-4">
                {metrics.orders.byPlan.map((item) => (
                  <div key={item.plan} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.plan}</div>
                      <div className="text-sm text-gray-500">{item.count} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatWeight(item.weightLbs)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Compliance Checkpoints</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {checkpointCounts.PASS || 0}
                </div>
                <div className="text-sm text-gray-500">Passed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {checkpointCounts.FAIL || 0}
                </div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">
                  {checkpointCounts.PENDING || 0}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Summary */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Volume Summary</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hanging Weight</span>
                <span className="font-semibold">
                  {formatWeight(metrics.volume.totalHangingWeightLbs)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Boxed Weight (est.)</span>
                <span className="font-semibold">
                  {formatWeight(metrics.volume.totalBoxedWeightLbs)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Yield Rate</span>
                <span className="font-semibold">
                  {metrics.volume.totalHangingWeightLbs > 0
                    ? Math.round(
                        (metrics.volume.totalBoxedWeightLbs /
                          metrics.volume.totalHangingWeightLbs) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}
