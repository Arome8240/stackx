'use client';

import * as React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (opts: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = React.useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const duration = opts.duration ?? 4000;
    setToasts(prev => [...prev, { ...opts, id }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
  error:   <AlertCircle  className="w-5 h-5 text-destructive shrink-0" />,
  info:    <Info         className="w-5 h-5 text-primary shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-green-500/30',
  error:   'border-destructive/30',
  info:    'border-primary/30',
  warning: 'border-yellow-500/30',
};

function ToastContainer() {
  const { toasts, dismiss } = React.useContext(ToastContext)!;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border bg-card shadow-modal animate-slide-in-right',
            borderMap[t.type],
          )}
        >
          {iconMap[t.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
