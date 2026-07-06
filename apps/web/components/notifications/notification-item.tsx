'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, Repeat2, MessageCircle, UserPlus, Zap, AtSign } from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import type { Notification } from '@/lib/types/social';

const ICONS: Record<Notification['type'], { icon: typeof Heart; color: string; bg: string }> = {
  like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
  recast: { icon: Repeat2, color: 'text-green-400', bg: 'bg-green-500/10' },
  reply: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  follow: { icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10' },
  tip: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  mention: { icon: AtSign, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

const MESSAGES: Record<Notification['type'], (n: Notification) => string> = {
  like: () => 'liked your cast',
  recast: () => 'recasted your cast',
  reply: () => 'replied to your cast',
  follow: () => 'started following you',
  tip: (n) => `tipped you ${n.amount ? `${n.amount} STX` : ''}`,
  mention: () => 'mentioned you in a cast',
};

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const meta = ICONS[notification.type];
  const Icon = meta.icon;
  const message = MESSAGES[notification.type]?.(notification) ?? '';
  const href = notification.cast ? `/cast/${notification.cast.id}` : `/profile/${notification.from.username}`;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors',
        !notification.read && 'bg-primary/[0.04]',
      )}
    >
      <div className="relative shrink-0">
        <Avatar size="sm" src={notification.from.avatarUrl} fallback={notification.from.displayName ?? notification.from.username} />
        <div className={cn('absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center', meta.bg)}>
          <Icon className={cn('w-2.5 h-2.5', meta.color)} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{notification.from.displayName ?? notification.from.username} </span>
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimeAgo(notification.timestamp)}
        </p>
      </div>

      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </Link>
  );
}
