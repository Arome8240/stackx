'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  defaultValue?: string;
}

export function SearchBar({ placeholder = 'Search StackX…', className, autoFocus, defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    }
  }, [debouncedQuery, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none', focused ? 'text-primary' : 'text-muted-foreground')} />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full pl-9 pr-8 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground bg-white/[0.04] border transition-colors outline-none',
          focused ? 'border-ring bg-white/[0.06]' : 'border-border/40 hover:border-border/60',
        )}
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); inputRef.current?.focus(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
