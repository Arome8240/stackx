'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked?: boolean | 'indeterminate';
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  id?: string;
}

export function Checkbox({ checked, onChange, disabled, label, description, className, id }: CheckboxProps) {
  const inputId = id ?? React.useId();

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        role="checkbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
        aria-disabled={disabled}
        id={inputId}
        onClick={() => !disabled && onChange?.(checked === true ? false : true)}
        className={cn(
          'mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
          checked && checked !== 'indeterminate'
            ? 'bg-violet-600 border-violet-600'
            : checked === 'indeterminate'
              ? 'bg-violet-600/50 border-violet-600'
              : 'border-border bg-transparent hover:border-violet-500',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer',
        )}
      >
        {checked === 'indeterminate' ? (
          <Minus className="w-2.5 h-2.5 text-white" />
        ) : checked ? (
          <Check className="w-2.5 h-2.5 text-white" />
        ) : null}
      </button>
      {(label || description) && (
        <label htmlFor={inputId} className={cn('flex flex-col', !disabled && 'cursor-pointer')}>
          {label && <span className="text-sm text-foreground font-medium">{label}</span>}
          {description && <span className="text-xs text-muted-foreground mt-0.5">{description}</span>}
        </label>
      )}
    </div>
  );
}
