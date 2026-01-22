import Link from 'next/link';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact an administrator if you
            believe this is an error.
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Dashboard
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
