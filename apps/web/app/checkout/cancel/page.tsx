'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const allocationId = searchParams.get('allocation_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-yellow-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your order has not been placed. Don't worry - your reservation is still saved as a draft.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Need help?</h3>
            <p className="text-sm text-gray-600">
              If you experienced any issues during checkout or have questions about pricing,
              please don't hesitate to contact us. We're here to help.
            </p>
          </div>

          <div className="space-y-3">
            {allocationId && (
              <Link
                href="/reserve"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Link>
            )}
            <Link
              href="/dashboard"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              View Your Drafts <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
