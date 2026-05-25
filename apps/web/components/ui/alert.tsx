'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  description?: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

const alertConfig: Record<AlertType, { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  success: { icon: CheckCircle2, className: 'bg-green-500/10 border-green-500/30 text-green-400' },
  warning: { icon: AlertCircle, className: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  error: { icon: XCircle, className: 'bg-red-500/10 border-red-500/30 text-red-400' },
};

export function Alert({
  type = 'info',
  title,
  description,
  className,
  dismissible = false,
  onDismiss,
  children,
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const { icon: Icon, className: typeClassName } = alertConfig[type];

  if (dismissed) return null;

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl border text-sm',
        typeClassName,
        className,
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium mb-0.5">{title}</p>}
        {description && <p className="opacity-80">{description}</p>}
        {children}
      </div>
      {dismissible && (
        <button
          onClick={() => { setDismissed(true); onDismiss?.(); }}
          className="p-0.5 rounded hover:opacity-70 transition-opacity shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
