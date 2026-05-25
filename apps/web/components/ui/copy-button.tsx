'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ text, className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const btnSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy'}
      className={cn(
        btnSize,
        'rounded-md transition-colors',
        copied
          ? 'text-green-400 bg-green-500/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
        className,
      )}
    >
      {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
    </button>
  );
}
