'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Bell, User, MessageCircle, Wallet } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Profile', href: '/profile/alice', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-4 flex-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
