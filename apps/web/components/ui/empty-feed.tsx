'use client';

import * as React from 'react';
import { MessageSquare, UserPlus, Compass } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyFeedProps {
  type?: 'home' | 'profile' | 'channel' | 'search';
  className?: string;
}

const CONFIGS = {
  home: {
    icon: MessageSquare,
    title: 'Your feed is empty',
    description: 'Follow some accounts or join channels to see casts here.',
    actions: [
      { label: 'Explore', href: '/explore', variant: 'primary' as const, icon: Compass },
      { label: 'Find people', href: '/search', variant: 'outline' as const, icon: UserPlus },
    ],
  },
  profile: {
    icon: MessageSquare,
    title: 'No casts yet',
    description: 'This user hasn\'t posted anything yet.',
    actions: [],
  },
  channel: {
    icon: MessageSquare,
    title: 'No casts in this channel',
    description: 'Be the first to post in this channel.',
    actions: [],
  },
  search: {
    icon: Compass,
    title: 'No results found',
    description: 'Try different keywords or check your spelling.',
    actions: [],
  },
};

export function EmptyFeed({ type = 'home', className }: EmptyFeedProps) {
  const config = CONFIGS[type];
  const Icon = config.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary/60" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">{config.description}</p>
      {config.actions.length > 0 && (
        <div className="flex gap-3">
          {config.actions.map(({ label, href, variant, icon: ActionIcon }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                variant === 'primary' ? 'btn-primary' : 'btn-outline',
                'gap-2',
              )}
            >
              <ActionIcon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
