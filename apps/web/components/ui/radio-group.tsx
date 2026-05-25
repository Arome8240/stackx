'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function RadioGroup({ options, value, onChange, name, orientation = 'vertical', className }: RadioGroupProps) {
  const groupName = name ?? React.useId();

  return (
    <div
      role="radiogroup"
      className={cn('flex', orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-4 flex-wrap', className)}
    >
      {options.map((option) => (
        <RadioItem
          key={option.value}
          {...option}
          name={groupName}
          checked={value === option.value}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

interface RadioItemProps extends RadioOption {
  name: string;
  checked: boolean;
  onChange?: (value: string) => void;
}

function RadioItem({ value, label, description, disabled, name, checked, onChange }: RadioItemProps) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start gap-3',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      <div className="relative mt-0.5 shrink-0">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.(value)}
          className="sr-only peer"
        />
        <div
          className={cn(
            'w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center',
            checked ? 'border-violet-500' : 'border-border',
          )}
        >
          {checked && <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-foreground font-medium">{label}</span>
        {description && <span className="text-xs text-muted-foreground mt-0.5">{description}</span>}
      </div>
    </label>
  );
}
