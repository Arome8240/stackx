import * as React from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono rounded border',
        'bg-white/5 border-border/50 text-muted-foreground',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
