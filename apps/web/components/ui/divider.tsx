import * as React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
  label?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ label, className, orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn('w-px h-full bg-border/40', className)} />;
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-border/40" />
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex-1 h-px bg-border/40" />
      </div>
    );
  }

  return <div className={cn('h-px bg-border/40', className)} />;
}
