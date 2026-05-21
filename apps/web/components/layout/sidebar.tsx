'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Bell, User, Search, MessageCircle, Wallet, Smartphone } from 'lucide-react';
import { ConnectWallet } from '../wallet/connect-wallet';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Mini Apps', href: '/mini-apps', icon: Smartphone },
  { name: 'Channels', href: '/channels', icon: Tv },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Search', href: '/search', icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card p-4 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <h1 className="text-2xl font-bold text-primary">StackX</h1>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connection */}
        <div className="mt-auto pt-4 border-t border-border">
          <ConnectWallet />
        </div>
      </div>
    </aside>
  );
}
