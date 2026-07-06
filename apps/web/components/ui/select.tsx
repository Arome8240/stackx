'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function Select({ options, value, onChange, placeholder = 'Select…', disabled, className, error }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
          'bg-white/[0.03] text-foreground',
          error ? 'border-red-500/60' : 'border-border/60 focus:border-ring',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-ring/60',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(!selected && 'text-muted-foreground')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {open && (
        <div className="absolute z-50 w-full mt-1 glass rounded-lg border border-border/50 shadow-lg overflow-hidden">
          <ul role="listbox" className="py-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value);
                    setOpen(false);
                  }
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors',
                  option.value === value ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-white/5',
                  option.disabled && 'opacity-40 cursor-not-allowed',
                )}
              >
                {option.label}
                {option.value === value && <Check className="w-3.5 h-3.5" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
