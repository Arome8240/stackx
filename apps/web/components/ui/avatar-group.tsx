'use client';

import * as React from 'react';
import { Avatar } from './avatar';
import { cn } from '@/lib/utils';

interface AvatarGroupUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

interface AvatarGroupProps {
  users: AvatarGroupUser[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function AvatarGroup({ users, max = 5, size = 'sm', className }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  const sizeMap = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm' };
  const overlapMap = { xs: '-ml-2', sm: '-ml-2.5', md: '-ml-3' };

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((user, i) => (
        <div
          key={user.id}
          className={cn(i > 0 && overlapMap[size], 'relative rounded-full ring-2 ring-background')}
          style={{ zIndex: visible.length - i }}
        >
          <Avatar
            size={size}
            src={user.avatarUrl}
            fallback={user.displayName ?? user.username}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(overlapMap[size], 'relative rounded-full ring-2 ring-background', sizeMap[size], 'flex items-center justify-center bg-white/10 text-muted-foreground font-medium')}
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
