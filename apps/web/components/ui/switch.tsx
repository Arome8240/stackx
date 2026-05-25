'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Switch({ checked, onChange, disabled, label, description, size = 'md', className }: SwitchProps) {
  const id = React.useId();
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  };
  const s = sizes[size];

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {(label || description) && (
        <label htmlFor={id} className={cn('flex flex-col', !disabled && 'cursor-pointer')}>
          {label && <span className="text-sm text-foreground font-medium">{label}</span>}
          {description && <span className="text-xs text-muted-foreground mt-0.5">{description}</span>}
        </label>
      )}
      <button
        role="switch"
        id={id}
        aria-checked={checked}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors',
          s.track,
          checked ? 'bg-violet-600' : 'bg-white/10',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition-transform',
            s.thumb,
            checked ? s.translate : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}
