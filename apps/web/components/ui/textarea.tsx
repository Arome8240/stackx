import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, maxLength, showCount, value, ...props }, ref) => {
    const len = typeof value === 'string' ? value.length : 0;
    const isNearLimit = maxLength ? len > maxLength * 0.8 : false;
    const isOverLimit  = maxLength ? len > maxLength : false;

    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-xl border bg-input px-4 py-3 text-sm text-foreground resize-none',
            'placeholder:text-muted-foreground transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-destructive' : 'border-border',
            className,
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          {showCount && maxLength && (
            <span className={cn('text-xs tabular-nums',
              isOverLimit  ? 'text-destructive' :
              isNearLimit  ? 'text-yellow-500'  :
                             'text-muted-foreground'
            )}>
              {len}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
