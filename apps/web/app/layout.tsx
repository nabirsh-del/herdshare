import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HerdShare | American Beef. American Values.',
  description:
    'HerdShare connects Texas ranchers directly with fraternities and restaurants. Lock in beef at $5-6/lb flat rate. Premium beef at a predictable price.',
  keywords: ['beef', 'rancher', 'farm to table', 'meat share', 'bulk beef', 'fraternity', 'restaurant', 'Texas beef'],
};

// Clerk is disabled for preview - enable when API keys are configured
const CLERK_ENABLED = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (CLERK_ENABLED) {
    const { ClerkProvider } = await import('@clerk/nextjs');
    return (
      <ClerkProvider>
        <html lang="en" className={inter.variable}>
          <body className="min-h-screen bg-gray-50 antialiased">
            {children}
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
