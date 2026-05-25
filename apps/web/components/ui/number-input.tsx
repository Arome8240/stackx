'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({ value = 0, onChange, min, max, step = 1, label, suffix, disabled, className }: NumberInputProps) {
  function clamp(v: number) {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  }

  function increment() { onChange?.(clamp(value + step)); }
  function decrement() { onChange?.(clamp(value - step)); }

  return (
    <div className={className}>
      {label && <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>}
      <div className={cn('flex items-center rounded-lg border border-border/60 bg-white/[0.03] overflow-hidden', disabled && 'opacity-50')}>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChange?.(clamp(parseFloat(e.target.value) || 0))}
          className="flex-1 px-3 py-2 bg-transparent text-sm text-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="px-2 text-sm text-muted-foreground shrink-0">{suffix}</span>}
        <div className="flex flex-col border-l border-border/40 shrink-0">
          <button onClick={increment} disabled={disabled || (max !== undefined && value >= max)} className="px-2 py-1 hover:bg-white/5 disabled:opacity-30 transition-colors">
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          </button>
          <button onClick={decrement} disabled={disabled || (min !== undefined && value <= min)} className="px-2 py-1 hover:bg-white/5 disabled:opacity-30 transition-colors border-t border-border/40">
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
