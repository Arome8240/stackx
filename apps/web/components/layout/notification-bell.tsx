'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '@/lib/hooks/use-notifications';
import { useCurrentUser } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils';

export function NotificationBell({ className }: { className?: string }) {
  const { data: user } = useCurrentUser();
  const unread = useUnreadCount(user?.stxAddress ?? null);

  return (
    <Link
      href="/notifications"
      aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      className={cn('relative p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground', className)}
    >
      <Bell className="w-5 h-5" />
      {unread > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1 leading-none">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
