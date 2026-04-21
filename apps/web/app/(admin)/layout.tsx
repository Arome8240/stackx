'use client';

import { useStacks } from '@/components/providers/stacks-provider';
import { ConnectWallet } from '@/components/connect-wallet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Hospitals', href: '/admin/hospitals' },
  { name: 'Patients', href: '/admin/patients' },
  { name: 'Appointments', href: '/admin/appointments' },
  { name: 'Prescriptions', href: '/admin/prescriptions' },
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useStacks();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Staxial Health Admin</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to access the admin dashboard</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Access Denied</h1>
          <p className="text-gray-400 mb-8">
            You don't have permission to access the admin dashboard
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Staxial Health</h1>
              <span className="ml-3 px-2 py-1 bg-blue-600 text-xs rounded">Admin</span>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-[calc(100vh-4rem)] border-r border-gray-700">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
