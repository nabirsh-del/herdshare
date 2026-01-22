'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The webhook handles the status update
    // Just show success message
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirming your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your payment and your beef share is now reserved.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex gap-2">
                <span className="font-semibold text-brand-600">1.</span>
                We'll aggregate orders for your delivery window
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-brand-600">2.</span>
                Your order will be assigned to a local rancher
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-brand-600">3.</span>
                Processing and cold-chain verification will occur
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-brand-600">4.</span>
                You'll receive delivery notification with tracking
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              View Your Orders <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="btn-secondary w-full">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
