'use client';

import { useEffect, useState } from 'react';
import { formatDate, formatWeight, getStatusColor, getProductPlanLabel } from '@/lib/utils';
import {
  Truck,
  Package,
  TrendingUp,
  Calendar,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

type Assignment = {
  id: string;
  status: string;
  productPlan: string;
  targetDeliveryWindowStart: string;
  targetDeliveryWindowEnd: string;
  estimatedHangingWeightLbs: number | null;
  buyer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  complianceCheckpoints: Array<{
    checkpointType: string;
    passFail: string;
    timestamp: string;
  }>;
};

type DemandByPlan = {
  productPlan: string;
  orderCount: number;
  totalWeightLbs: number;
};

type WeeklyDemand = {
  weekStart: string;
  weekEnd: string;
  orderCount: number;
  totalWeightLbs: number;
};

type Commitment = {
  id: string;
  status: string;
  rolling90DayCommitmentLbs: number;
  availableHeadCount: number;
  periodStart: string;
  periodEnd: string;
};

export default function RancherDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [demandByPlan, setDemandByPlan] = useState<DemandByPlan[]>([]);
  const [weeklyDemand, setWeeklyDemand] = useState<WeeklyDemand[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch('/api/rancher/assignments');
      const data = await response.json();
      setAssignments(data.assignedOrders || []);
      setDemandByPlan(data.demand?.byPlan || []);
      setWeeklyDemand(data.demand?.weekly || []);
      setCommitments(data.commitments || []);
    } catch (error) {
      console.error('Error fetching rancher data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalDemandLbs = demandByPlan.reduce((sum, d) => sum + d.totalWeightLbs, 0);
  const totalOrders = demandByPlan.reduce((sum, d) => sum + d.orderCount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rancher Dashboard</h1>
          <p className="text-gray-600">View demand, assignments, and manage commitments</p>
        </div>
        <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Assigned Orders</div>
              <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">90-Day Demand</div>
              <div className="text-2xl font-bold text-gray-900">{formatWeight(totalDemandLbs)}</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Upcoming Orders</div>
              <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Commitments</div>
              <div className="text-2xl font-bold text-gray-900">
                {commitments.filter((c) => c.status === 'CONFIRMED').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demand by Plan */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Demand by Product Plan</h2>
          </div>
          <div className="p-6">
            {demandByPlan.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No demand data available</p>
            ) : (
              <div className="space-y-4">
                {demandByPlan.map((d) => (
                  <div key={d.productPlan} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{getProductPlanLabel(d.productPlan)}</div>
                      <div className="text-sm text-gray-500">{d.orderCount} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatWeight(d.totalWeightLbs)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Demand Chart */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Weekly Demand Forecast</h2>
          </div>
          <div className="p-6">
            {weeklyDemand.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No weekly data available</p>
            ) : (
              <div className="space-y-3">
                {weeklyDemand.slice(0, 8).map((week, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-600">
                      {formatDate(week.weekStart).slice(0, 6)}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (week.totalWeightLbs /
                              Math.max(...weeklyDemand.map((w) => w.totalWeightLbs), 1)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-medium">
                      {formatWeight(week.totalWeightLbs)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Orders */}
      <div className="card mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Assigned Orders</h2>
        </div>

        {assignments.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned orders</h3>
            <p className="text-gray-600">
              Orders will appear here once they are assigned to you
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {assignments.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getProductPlanLabel(order.productPlan)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.buyer.firstName} {order.buyer.lastName} •{' '}
                      {formatDate(order.targetDeliveryWindowStart)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {order.complianceCheckpoints.length > 0 ? (
                      order.complianceCheckpoints.every((c) => c.passFail === 'PASS') ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )
                    ) : null}
                    <span className="text-sm text-gray-500">
                      {order.complianceCheckpoints.length} checkpoints
                    </span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
