import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { getOrCreateUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@herdshare/db';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Truck,
  ClipboardCheck,
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateUser();

  if (!user) {
    redirect('/sign-in');
  }

  const navItems = getNavItems(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-brand-600">
                HerdShare
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.firstName} {user.lastName}
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                  {user.role}
                </span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-md whitespace-nowrap"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

function getNavItems(role: UserRole) {
  const baseItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
  ];

  // Buyer items
  if (role === UserRole.BUYER) {
    return [
      ...baseItems,
      {
        href: '/reserve',
        label: 'New Order',
        icon: <Package className="w-4 h-4" />,
      },
    ];
  }

  // Rancher items
  if (role === UserRole.RANCHER) {
    return [
      ...baseItems,
      {
        href: '/rancher',
        label: 'My Assignments',
        icon: <Truck className="w-4 h-4" />,
      },
      {
        href: '/rancher/commitments',
        label: 'Commitments',
        icon: <ClipboardCheck className="w-4 h-4" />,
      },
    ];
  }

  // Admin items
  if (role === UserRole.ADMIN) {
    return [
      ...baseItems,
      {
        href: '/admin/orders',
        label: 'Orders',
        icon: <Package className="w-4 h-4" />,
      },
      {
        href: '/admin/ranchers',
        label: 'Ranchers',
        icon: <Users className="w-4 h-4" />,
      },
      {
        href: '/admin/metrics',
        label: 'Metrics',
        icon: <BarChart3 className="w-4 h-4" />,
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: <Settings className="w-4 h-4" />,
      },
    ];
  }

  // Finance items
  if (role === UserRole.FINANCE) {
    return [
      ...baseItems,
      {
        href: '/admin/orders',
        label: 'Orders',
        icon: <Package className="w-4 h-4" />,
      },
      {
        href: '/admin/metrics',
        label: 'Metrics',
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ];
  }

  return baseItems;
}
