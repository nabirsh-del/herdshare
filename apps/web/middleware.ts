import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Clerk is disabled for preview - enable when API keys are configured
const CLERK_ENABLED = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')
);

export async function middleware(request: NextRequest) {
  // If Clerk is not configured, allow all requests
  if (!CLERK_ENABLED) {
    return NextResponse.next();
  }

  // Dynamic import of Clerk middleware when enabled
  const { authMiddleware, clerkClient } = await import('@clerk/nextjs');

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/api/webhooks/stripe',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/about',
    '/pricing',
    '/contact',
  ];

  // Define route patterns for role-based access
  const adminRoutes = ['/admin(.*)'];
  const rancherRoutes = ['/rancher(.*)'];
  const financeRoutes = ['/finance(.*)'];

  const middleware = authMiddleware({
    publicRoutes,
    afterAuth: async (auth, req) => {
      // Allow public routes
      if (!auth.userId && publicRoutes.some((route) => req.nextUrl.pathname.match(new RegExp(`^${route}$`)))) {
        return NextResponse.next();
      }

      // Redirect unauthenticated users to sign-in
      if (!auth.userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Get user metadata for role check
      const user = await clerkClient.users.getUser(auth.userId);
      const role = (user.publicMetadata?.role as string) || 'BUYER';

      const pathname = req.nextUrl.pathname;

      // Admin routes - only ADMIN role
      if (adminRoutes.some((route) => pathname.match(new RegExp(`^${route}$`)))) {
        if (role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }

      // Rancher routes - ADMIN or RANCHER role
      if (rancherRoutes.some((route) => pathname.match(new RegExp(`^${route}$`)))) {
        if (!['ADMIN', 'RANCHER'].includes(role)) {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }

      // Finance routes - ADMIN or FINANCE role
      if (financeRoutes.some((route) => pathname.match(new RegExp(`^${route}$`)))) {
        if (!['ADMIN', 'FINANCE'].includes(role)) {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }

      return NextResponse.next();
    },
  });

  return middleware(request, {} as any);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
