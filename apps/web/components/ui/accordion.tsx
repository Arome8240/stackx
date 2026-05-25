'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpen = [], multiple = false, className }: AccordionProps) {
  const [open, setOpen] = React.useState<Set<string>>(new Set(defaultOpen));

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={cn('space-y-1', className)}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id} className="rounded-xl border border-border/40 overflow-hidden">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-foreground">{item.title}</span>
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', isOpen && 'rotate-180')} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground border-t border-border/40">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
