'use client';

import * as React from 'react';
import { CopyButton } from './copy-button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, filename, className, showLineNumbers = false }: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className={cn('rounded-xl border border-border/40 overflow-hidden', className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-border/40">
          <span className="text-xs text-muted-foreground font-mono">{filename ?? language}</span>
          <CopyButton text={code} size="sm" />
        </div>
      )}
      <div className="relative">
        {!filename && !language && (
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={code} size="sm" />
          </div>
        )}
        <pre className="overflow-x-auto p-4 text-sm font-mono text-foreground/90 leading-relaxed bg-white/[0.02]">
          <code>
            {showLineNumbers ? (
              lines.map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="select-none text-muted-foreground/50 text-right w-8 shrink-0">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
