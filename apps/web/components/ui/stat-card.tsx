'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ElementType;
  gradient?: boolean;
  className?: string;
}

export function StatCard({ label, value, change, changeLabel, icon: Icon, gradient, className }: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={cn('glass rounded-2xl p-4 space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
      </div>
      <p className={cn('text-2xl font-bold', gradient ? 'text-primary' : 'text-foreground')}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-muted-foreground')}>
          <TrendIcon className="w-3 h-3" />
          <span>{isPositive ? '+' : ''}{change}%{changeLabel ? ` ${changeLabel}` : ''}</span>
        </div>
      )}
    </div>
  );
}
