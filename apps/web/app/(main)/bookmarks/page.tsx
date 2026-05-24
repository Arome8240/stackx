'use client';

import * as React from 'react';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { CastCard } from '@/components/cast/cast-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import type { Cast } from '@/lib/types/social';

const MOCK_USER = {
  id: 'u2', username: 'satoshi_hiro', displayName: 'Hiro Systems',
  bio: 'Building on Stacks', avatar: '', walletAddress: 'SP2...',
  followersCount: 18000, followingCount: 200, castsCount: 430,
  tipsReceived: 2100000, nftsMinted: 0, verified: true, tier: 1 as const,
  joinedAt: '2023-03-15',
};

const BOOKMARKED: Cast[] = [
  {
    id: '2', author: MOCK_USER,
    content: 'Just shipped Clarinet v3.0 with blazing-fast contract testing and new devnet support. 🚀 #ClarityLang',
    images: [], timestamp: new Date(Date.now() - 2_700_000).toISOString(), blockHeight: 142498,
    likesCount: 156, recastsCount: 44, repliesCount: 23, tipsCount: 5, tipsTotal: 1_500_000,
    isBookmarked: true,
  },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = React.useState(BOOKMARKED);
  const [query, setQuery] = React.useState('');

  const filtered = query
    ? bookmarks.filter(c => c.content.toLowerCase().includes(query.toLowerCase()))
    : bookmarks;

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Bookmarks</h1>
          {bookmarks.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setBookmarks([])} icon={<Trash2 className="w-4 h-4 text-destructive" />}>
              <span className="text-destructive">Clear all</span>
            </Button>
          )}
        </div>
        {bookmarks.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search bookmarks"
              className="w-full rounded-full border border-border bg-muted pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        )}
      </header>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8" />}
          title={query ? 'No matching bookmarks' : 'No bookmarks yet'}
          description={query ? 'Try a different search.' : 'Save casts to read later by tapping the bookmark icon.'}
        />
      ) : (
        <div>
          <div className="px-4 py-3 text-xs text-muted-foreground">
            {filtered.length} saved cast{filtered.length !== 1 ? 's' : ''}
          </div>
          {filtered.map(cast => <CastCard key={cast.id} cast={cast} />)}
        </div>
      )}
    </div>
  );
}
