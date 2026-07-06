'use client';

import * as React from 'react';
import { Search, X, TrendingUp, Hash, Users, FileText } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { CastCard } from '@/components/cast/cast-card';
import { CastCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatNumber } from '@/lib/utils';
import type { User, Cast } from '@/lib/types/social';
import Link from 'next/link';

const TABS = [
  { id: 'top',     label: 'Top',     icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'casts',   label: 'Casts',   icon: <FileText   className="w-3.5 h-3.5" /> },
  { id: 'people',  label: 'People',  icon: <Users      className="w-3.5 h-3.5" /> },
  { id: 'channels',label: 'Channels',icon: <Hash       className="w-3.5 h-3.5" /> },
];

const TRENDING_TOPICS = [
  { tag: '#StacksBTC',   volume: 2840 },
  { tag: '#ClarityLang', volume: 1205 },
  { tag: '#DeSo',        volume: 980  },
  { tag: '#Web3Social',  volume: 754  },
  { tag: '#NFTDrop',     volume: 612  },
  { tag: '#BitcoinL2',   volume: 540  },
  { tag: '#SBF',         volume: 430  },
  { tag: '#Ord inscribe',volume: 380  },
];

const MOCK_USER: User = {
  id: 'u1', username: 'muneeb', displayName: 'Muneeb Ali',
  bio: 'Co-founder @Stacks', avatarUrl: '', walletAddress: 'SP1...',
  followersCount: 42000, followingCount: 800, castsCount: 1200,
  tipsReceived: 5000000, nftsMinted: 3, isVerified: true, tier: 2, joinedAt: '2023-01-01',
};

const MOCK_RESULTS_CAST: Cast[] = [
  {
    id: '10', author: MOCK_USER,
    content: 'Bitcoin L2s are going to unlock entirely new use cases. #StacksBTC is the real deal.',
    images: [], timestamp: new Date(Date.now() - 900000).toISOString(), blockHeight: 142400,
    likesCount: 284, recastsCount: 91, repliesCount: 47, tipsCount: 5, tipsTotal: 2000000,
  },
];

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState('top');
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const hasQuery = query.trim().length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      {/* Sticky search bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border p-3 space-y-0">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search StackX"
            className="w-full rounded-full border border-border bg-muted pl-10 pr-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {hasQuery && <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="mt-2 px-0 border-0 gap-0" />}
      </header>

      {/* Content */}
      {!hasQuery ? (
        /* Trending topics */
        <div>
          <div className="px-4 pt-5 pb-3">
            <h2 className="font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trending topics
            </h2>
          </div>
          <div className="divide-y divide-border">
            {TRENDING_TOPICS.map(({ tag, volume }, i) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors text-left"
              >
                <div>
                  <span className="text-xs text-muted-foreground">{i + 1} · Trending</span>
                  <p className="text-sm font-semibold">{tag}</p>
                  <span className="text-xs text-muted-foreground">{formatNumber(volume)} casts</span>
                </div>
                <Hash className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-0">
          {Array.from({ length: 3 }).map((_, i) => <CastCardSkeleton key={i} />)}
        </div>
      ) : (
        <div>
          {/* People results */}
          {(tab === 'top' || tab === 'people') && (
            <div>
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">People</h2>
              </div>
              <UserResult user={MOCK_USER} />
            </div>
          )}

          {/* Cast results */}
          {(tab === 'top' || tab === 'casts') && (
            <div>
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Casts</h2>
              </div>
              {MOCK_RESULTS_CAST.map(c => <CastCard key={c.id} cast={c} />)}
            </div>
          )}

          {tab === 'channels' && (
            <EmptyState
              icon={<Hash className="w-8 h-8" />}
              title="No channels found"
              description={`No channels matching "${query}"`}
            />
          )}
        </div>
      )}
    </div>
  );
}

function UserResult({ user }: { user: User }) {
  const [following, setFollowing] = React.useState(false);
  return (
    <Link href={`/profile/${user.username}`} className="flex items-start gap-3 px-4 py-3 hover:bg-accent/30 transition-colors">
      <Avatar src={user.avatarUrl} fallback={user.displayName} size="md" verified={user.isVerified} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm">{user.displayName}</span>
          {user.tier === 2 && <Badge variant="nft" className="text-[10px]">Creator</Badge>}
        </div>
        <span className="text-xs text-muted-foreground">@{user.username}</span>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{user.bio}</p>
        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
          <span><strong className="text-foreground">{formatNumber(user.followersCount)}</strong> followers</span>
          <span><strong className="text-foreground">{formatNumber(user.castsCount)}</strong> casts</span>
        </div>
      </div>
      <Button
        size="xs"
        variant={following ? 'outline' : 'primary'}
        onClick={e => { e.preventDefault(); setFollowing(v => !v); }}
      >
        {following ? 'Following' : 'Follow'}
      </Button>
    </Link>
  );
}
