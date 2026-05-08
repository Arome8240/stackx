'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/mock-data/users';

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Channels', href: '/channels', icon: '📺' },
  { name: 'Notifications', href: '/notifications', icon: '🔔' },
  { name: 'Profile', href: '/profile/alice', icon: '👤' },
  { name: 'Search', href: '/search', icon: '🔍' },
];

export function Sidebar() {
  const pathname = usePathname();
  const currentUser = getCurrentUser();

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
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <Link
          href={`/profile/${currentUser.username}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors mt-auto"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">@{currentUser.username}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
