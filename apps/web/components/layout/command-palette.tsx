'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Hash, User, MessageSquare, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: string;
}

const STATIC_COMMANDS: CommandItem[] = [
  { id: 'home', label: 'Home', subtitle: 'Your personalized feed', icon: MessageSquare, href: '/', category: 'Pages' },
  { id: 'explore', label: 'Explore', subtitle: 'Discover trending casts', icon: Hash, href: '/explore', category: 'Pages' },
  { id: 'channels', label: 'Channels', subtitle: 'Browse communities', icon: Hash, href: '/channels', category: 'Pages' },
  { id: 'marketplace', label: 'NFT Marketplace', subtitle: 'Buy and sell Cast NFTs', icon: MessageSquare, href: '/marketplace', category: 'Pages' },
  { id: 'governance', label: 'Governance', subtitle: 'Vote on platform proposals', icon: MessageSquare, href: '/governance', category: 'Pages' },
  { id: 'compose', label: 'New Cast', subtitle: 'Write a new cast', icon: MessageSquare, href: '/compose', category: 'Actions' },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return STATIC_COMMANDS;
    const q = query.toLowerCase();
    return STATIC_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.subtitle?.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = React.useMemo(() => {
    const g: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!g[item.category]) g[item.category] = [];
      g[item.category].push(item);
    }
    return g;
  }, [filtered]);

  if (!open) return null;

  function execute(item: CommandItem) {
    if (item.href) router.push(item.href);
    if (item.action) item.action();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 glass rounded-2xl shadow-modal border border-border/50 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) execute(filtered[0]);
            }}
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No results for "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground">{category}</div>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => execute(item)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.06] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm text-foreground">{item.label}</div>
                      {item.subtitle && <div className="text-xs text-muted-foreground">{item.subtitle}</div>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-border/40 flex items-center gap-4 text-xs text-muted-foreground">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
