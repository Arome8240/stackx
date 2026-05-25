'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ElementType;
  iconColor?: string;
  active?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-2 bottom-2 w-px bg-border/40" aria-hidden />
      <ol className="space-y-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="relative flex gap-4 pl-10">
              <div className={cn('absolute left-2 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center', item.active ? 'bg-violet-600 border-violet-600' : 'bg-background border-border/60')}>
                {Icon && <Icon className={cn('w-2.5 h-2.5', item.iconColor ?? 'text-muted-foreground', item.active && 'text-white')} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', item.active ? 'text-foreground' : 'text-muted-foreground')}>{item.title}</p>
                {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                {item.timestamp && <p className="text-xs text-muted-foreground/60 mt-0.5">{item.timestamp}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
