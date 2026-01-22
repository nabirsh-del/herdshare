import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">HerdShare</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-brand-600 hover:bg-brand-700',
              card: 'shadow-none',
            },
          }}
        />
      </div>
    </div>
  );
}
