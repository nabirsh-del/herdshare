import { auth, currentUser } from '@clerk/nextjs';
import { prisma } from './db';
import { UserRole } from '@herdshare/db';

export type AuthUser = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
};

// Get the current user from database, creating if doesn't exist
export async function getOrCreateUser(): Promise<AuthUser | null> {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    return null;
  }

  // Get role from Clerk metadata or default to BUYER
  const role = (clerkUser.publicMetadata?.role as UserRole) || UserRole.BUYER;

  // Find or create user in database using upsert to avoid race conditions
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role,
    },
    create: {
      clerkId: userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role,
    },
  });

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

// Check if user has required role
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  // ADMIN has access to everything
  if (userRole === UserRole.ADMIN) {
    return true;
  }
  return requiredRoles.includes(userRole);
}

// Require authentication and optionally check role
export async function requireAuth(requiredRoles?: UserRole[]): Promise<AuthUser> {
  const user = await getOrCreateUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  if (requiredRoles && !hasRole(user.role, requiredRoles)) {
    throw new Error(`Unauthorized: Requires one of these roles: ${requiredRoles.join(', ')}`);
  }

  return user;
}
