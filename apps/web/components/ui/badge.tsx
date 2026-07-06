import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'nft' | 'tip' | 'outline';
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:   'bg-secondary text-secondary-foreground',
  primary:   'bg-primary/15 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  success:   'bg-green-500/15 text-green-500',
  warning:   'bg-yellow-500/15 text-yellow-400',
  error:     'bg-destructive/15 text-destructive',
  nft:       'bg-nft/15 text-nft',
  tip:       'bg-yellow-500/15 text-yellow-400',
  outline:   'border border-border text-foreground',
};

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantMap[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
