'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  label?: string;
  className?: string;
}

export function TagInput({ value, onChange, placeholder = 'Add tag…', maxTags = 10, label, className }: TagInputProps) {
  const [input, setInput] = React.useState('');

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase().replace(/^#/, '');
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInput('');
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className={className}>
      {label && <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>}
      <div className={cn('flex flex-wrap gap-1.5 p-2 rounded-lg border border-border/60 bg-white/[0.03] min-h-[42px] focus-within:border-violet-500/60 transition-colors')}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-medium border border-violet-500/20">
            #{tag}
            <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        {value.length < maxTags && (
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(input)}
            placeholder={value.length === 0 ? placeholder : undefined}
            className="flex-1 min-w-[80px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{value.length}/{maxTags} tags · Press Enter or comma to add</p>
    </div>
  );
}
