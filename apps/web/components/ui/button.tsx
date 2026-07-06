'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:     'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97]',
  secondary:   'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.97]',
  ghost:       'hover:bg-accent hover:text-accent-foreground active:scale-[0.97]',
  outline:     'border border-border hover:bg-accent hover:text-accent-foreground active:scale-[0.97]',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.97]',
  success:     'bg-success text-success-foreground hover:bg-success/90 active:scale-[0.97]',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  xs:   'h-7 px-3 text-xs rounded-lg gap-1',
  sm:   'h-8 px-3.5 text-sm rounded-lg gap-1.5',
  md:   'h-10 px-5 text-sm rounded-xl gap-2',
  lg:   'h-11 px-6 text-base rounded-xl gap-2',
  icon: 'h-9 w-9 rounded-xl p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!loading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children}
        {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
