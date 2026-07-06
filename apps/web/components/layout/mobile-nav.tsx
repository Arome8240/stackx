'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, User, PenSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home',   href: '/',             icon: Home },
  { label: 'Search', href: '/search',        icon: Search },
  { label: 'Alerts', href: '/notifications', icon: Bell },
  { label: 'Profile',href: '/profile',       icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-card/80 backdrop-blur-md border-t border-border lg:hidden z-50 pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {/* First two nav items */}
        {navItems.slice(0, 2).map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors duration-150',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('w-6 h-6', active && 'drop-shadow-[0_0_4px_hsl(var(--primary))]')} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Center cast FAB */}
        <Link
          href="/compose"
          className="flex-shrink-0 mx-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center transition-transform duration-150 active:scale-95"
          aria-label="Compose cast"
        >
          <PenSquare className="w-5 h-5 text-white" />
        </Link>

        {/* Last two nav items */}
        {navItems.slice(2).map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors duration-150',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('w-6 h-6', active && 'drop-shadow-[0_0_4px_hsl(var(--primary))]')} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
