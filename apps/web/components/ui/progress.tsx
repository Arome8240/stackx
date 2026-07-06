'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  color?: 'primary' | 'green' | 'blue' | 'red' | 'yellow';
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorMap = {
  primary: 'bg-primary',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
};

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  fillClassName,
  showLabel = false,
  size = 'md',
  animated = false,
  color = 'primary',
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full rounded-full bg-white/5 overflow-hidden',
          sizeMap[size],
          trackClassName,
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorMap[color],
            animated && 'animate-pulse',
            fillClassName,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground mt-1 block">{pct.toFixed(0)}%</span>
      )}
    </div>
  );
}
