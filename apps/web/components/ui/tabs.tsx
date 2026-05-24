'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export function Tabs({ tabs, activeTab, onChange, className, variant = 'underline' }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        variant === 'underline' ? 'flex border-b border-border' : 'flex gap-1 p-1 bg-muted rounded-xl',
        className,
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium transition-colors duration-150',
            variant === 'underline'
              ? cn(
                  'px-4 py-3 border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )
              : cn(
                  'flex-1 px-3 py-1.5 rounded-lg',
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                ),
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn('text-xs rounded-full px-1.5 py-0.5',
              activeTab === tab.id ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
