'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Search, Bell, User, Hash, Bookmark,
  Wallet, MessageCircle, Settings, Zap, LayoutGrid,
  PenSquare, ShoppingBag, Vote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectWallet } from '../wallet/connect-wallet';
import { Button } from '../ui/button';

const navItems = [
  { label: 'Home',          href: '/',              icon: Home },
  { label: 'Explore',       href: '/explore',        icon: Hash },
  { label: 'Search',        href: '/search',         icon: Search },
  { label: 'Notifications', href: '/notifications',  icon: Bell },
  { label: 'Messages',      href: '/messages',       icon: MessageCircle },
  { label: 'Bookmarks',     href: '/bookmarks',      icon: Bookmark },
  { label: 'Channels',      href: '/channels',       icon: LayoutGrid },
  { label: 'Marketplace',   href: '/marketplace',    icon: ShoppingBag },
  { label: 'Governance',    href: '/governance',     icon: Vote },
  { label: 'Wallet',        href: '/wallet',         icon: Wallet },
  { label: 'Profile',       href: '/profile',        icon: User },
  { label: 'Settings',      href: '/settings',       icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-md hidden lg:flex flex-col p-4 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 py-2 mb-4 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-xl font-bold gradient-text">StackX</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0 transition-transform duration-150', 'group-hover:scale-110')} />
              <span className="text-sm">{label}</span>
              {label === 'Notifications' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cast Button */}
      <div className="mt-4">
        <Button className="w-full gap-2" size="md" icon={<PenSquare className="w-4 h-4" />}>
          Cast
        </Button>
      </div>

      {/* Wallet / User area */}
      <div className="mt-3 pt-3 border-t border-border">
        <ConnectWallet />
      </div>
    </aside>
  );
}
