'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Repeat2, MessageCircle, UserPlus, Zap, AtSign, Bell } from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import type { Notification } from '@/lib/types/social';

const ICONS = {
  like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
  recast: { icon: Repeat2, color: 'text-green-400', bg: 'bg-green-500/10' },
  reply: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  follow: { icon: UserPlus, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  tip: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  mention: { icon: AtSign, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  system: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-white/5' },
};

const MESSAGES: Record<string, (n: Notification) => string> = {
  like: () => 'liked your cast',
  recast: () => 'recasted your cast',
  reply: () => 'replied to your cast',
  follow: () => 'followed you',
  tip: (n) => `tipped you ${n.amount ? `${n.amount} STX` : ''}`,
  mention: () => 'mentioned you in a cast',
  system: (n) => n.body ?? 'System notification',
};

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const meta = ICONS[notification.type] ?? ICONS.system;
  const Icon = meta.icon;
  const message = MESSAGES[notification.type]?.(notification) ?? '';
  const href = notification.cast ? `/cast/${notification.cast}` : notification.actor ? `/profile/${notification.actor.username}` : '#';

  return (
    <Link
      href={href}
      className={cn(
        'flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors',
        !notification.read && 'bg-violet-500/[0.04]',
      )}
    >
      <div className="relative shrink-0">
        {notification.actor ? (
          <Avatar size="sm" src={notification.actor.avatarUrl} fallback={notification.actor.displayName ?? notification.actor.username} />
        ) : (
          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', meta.bg)}>
            <Icon className={cn('w-4 h-4', meta.color)} />
          </div>
        )}
        <div className={cn('absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center', meta.bg)}>
          <Icon className={cn('w-2.5 h-2.5', meta.color)} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          {notification.actor && (
            <span className="font-medium">{notification.actor.displayName ?? notification.actor.username} </span>
          )}
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimeAgo(new Date(notification.createdAt))}
        </p>
      </div>

      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1.5" />
      )}
    </Link>
  );
}
