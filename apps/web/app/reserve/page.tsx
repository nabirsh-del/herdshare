'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { formatCurrency, getProductPlanLabel, getEstimatedWeight } from '@/lib/utils';

type ProductPlan = 'WHOLE' | 'HALF' | 'QUARTER' | 'CUSTOM';

type FormData = {
  productPlan: ProductPlan;
  deliveryWindow: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    instructions: string;
  };
  storageCapacityConfirmed: boolean;
  cutsPreferences: {
    steakThickness: string;
    groundBeefPackSize: string;
    roastSize: string;
  };
};

const DEFAULT_PRICING = {
  WHOLE: { basePricePerLb: 650, processingFeePerLb: 125 },
  HALF: { basePricePerLb: 700, processingFeePerLb: 125 },
  QUARTER: { basePricePerLb: 750, processingFeePerLb: 125 },
  CUSTOM: { basePricePerLb: 800, processingFeePerLb: 150 },
};

const LOGISTICS_SURCHARGE = 50; // cents per lb (medium tier default)

export default function ReservePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    productPlan: 'QUARTER',
    deliveryWindow: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      instructions: '',
    },
    storageCapacityConfirmed: false,
    cutsPreferences: {
      steakThickness: '1',
      groundBeefPackSize: '1lb',
      roastSize: '3lb',
    },
  });

  // Generate delivery windows (next 8 weeks)
  const deliveryWindows = generateDeliveryWindows();

  function generateDeliveryWindows() {
    const windows: Array<{ value: string; label: string; start: Date; end: Date }> = [];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + (8 - now.getDay())); // Start next week

    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(startOfWeek);
      weekStart.setDate(startOfWeek.getDate() + i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const label = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      windows.push({
        value: weekStart.toISOString(),
        label,
        start: weekStart,
        end: weekEnd,
      });
    }

    return windows;
  }

  function calculateEstimate() {
    const weight = getEstimatedWeight(formData.productPlan);
    const avgWeight = (weight.min + weight.max) / 2;
    const pricing = DEFAULT_PRICING[formData.productPlan];

    const subtotal = pricing.basePricePerLb * avgWeight;
    const processing = pricing.processingFeePerLb * avgWeight;
    const logistics = LOGISTICS_SURCHARGE * avgWeight;
    const total = subtotal + processing + logistics;

    return {
      avgWeight,
      subtotal,
      processing,
      logistics,
      total,
    };
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const selectedWindow = deliveryWindows.find((w) => w.value === formData.deliveryWindow);
      if (!selectedWindow) {
        throw new Error('Please select a delivery window');
      }

      // Create allocation intent
      const response = await fetch('/api/allocation-intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productPlan: formData.productPlan,
          targetDeliveryWindowStart: selectedWindow.start.toISOString(),
          targetDeliveryWindowEnd: selectedWindow.end.toISOString(),
          shippingAddress: formData.shippingAddress,
          storageCapacityConfirmed: formData.storageCapacityConfirmed,
          cutsPreferences: formData.cutsPreferences,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create reservation');
      }

      const allocation = await response.json();

      // Create checkout session
      const checkoutResponse = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocationIntentId: allocation.id }),
      });

      if (!checkoutResponse.ok) {
        const data = await checkoutResponse.json();
        throw new Error(data.error || 'Failed to start checkout');
      }

      const { url } = await checkoutResponse.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }

  const estimate = calculateEstimate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserve Your Beef</h1>
        <p className="text-gray-600 mb-8">Complete the form below to reserve your share</p>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${step > s ? 'bg-brand-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Select Plan */}
        {step === 1 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Select Your Plan</h2>
            <div className="grid gap-4">
              {(['QUARTER', 'HALF', 'WHOLE'] as ProductPlan[]).map((plan) => {
                const weight = getEstimatedWeight(plan);
                const pricing = DEFAULT_PRICING[plan];
                return (
                  <label
                    key={plan}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.productPlan === plan
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productPlan"
                      value={plan}
                      checked={formData.productPlan === plan}
                      onChange={(e) =>
                        setFormData({ ...formData, productPlan: e.target.value as ProductPlan })
                      }
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{getProductPlanLabel(plan)}</div>
                      <div className="text-sm text-gray-600">
                        {weight.min}-{weight.max} lbs of premium beef
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-brand-600">
                        {formatCurrency(pricing.basePricePerLb)}/lb
                      </div>
                      <div className="text-sm text-gray-500">base price</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Delivery & Address */}
        {step === 2 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

            <div className="space-y-4">
              <div>
                <label className="label">Delivery Window</label>
                <select
                  value={formData.deliveryWindow}
                  onChange={(e) => setFormData({ ...formData, deliveryWindow: e.target.value })}
                  className="input"
                >
                  <option value="">Select a delivery window...</option>
                  {deliveryWindows.map((window) => (
                    <option key={window.value} value={window.value}>
                      {window.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Street Address</label>
                <input
                  type="text"
                  value={formData.shippingAddress.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, street: e.target.value },
                    })
                  }
                  className="input"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, city: e.target.value },
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    value={formData.shippingAddress.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, state: e.target.value },
                      })
                    }
                    className="input"
                    placeholder="CO"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="label">ZIP Code</label>
                <input
                  type="text"
                  value={formData.shippingAddress.zip}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, zip: e.target.value },
                    })
                  }
                  className="input"
                  placeholder="80202"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="label">Delivery Instructions (optional)</label>
                <textarea
                  value={formData.shippingAddress.instructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, instructions: e.target.value },
                    })
                  }
                  className="input"
                  rows={2}
                  placeholder="Gate code, specific delivery times, etc."
                />
              </div>

              <label className="flex items-start gap-3 p-4 border rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.storageCapacityConfirmed}
                  onChange={(e) =>
                    setFormData({ ...formData, storageCapacityConfirmed: e.target.checked })
                  }
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">I confirm I have adequate freezer storage</div>
                  <div className="text-sm text-gray-600">
                    A {getProductPlanLabel(formData.productPlan).toLowerCase()} requires approximately{' '}
                    {formData.productPlan === 'WHOLE'
                      ? '16-20'
                      : formData.productPlan === 'HALF'
                      ? '8-10'
                      : '4-5'}{' '}
                    cubic feet of freezer space
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.deliveryWindow || !formData.shippingAddress.zip}
                className="btn-primary flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Pay */}
        {step === 3 && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">{getProductPlanLabel(formData.productPlan)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Estimated Weight</span>
                <span className="font-medium">~{estimate.avgWeight} lbs</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Delivery Window</span>
                <span className="font-medium">
                  {deliveryWindows.find((w) => w.value === formData.deliveryWindow)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Delivery Address</span>
                <span className="font-medium text-right">
                  {formData.shippingAddress.street}
                  <br />
                  {formData.shippingAddress.city}, {formData.shippingAddress.state}{' '}
                  {formData.shippingAddress.zip}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Price Estimate</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    Base ({formatCurrency(DEFAULT_PRICING[formData.productPlan].basePricePerLb)}/lb × {estimate.avgWeight} lbs)
                  </span>
                  <span>{formatCurrency(estimate.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing</span>
                  <span>{formatCurrency(estimate.processing)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatCurrency(estimate.logistics)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(estimate.total)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Final price may vary based on actual hanging weight. You will receive a final invoice
                after processing.
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.storageCapacityConfirmed}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
