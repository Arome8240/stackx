'use client';

import * as React from 'react';
import { CastComposer } from '@/components/cast/cast-composer';
import { CastCard } from '@/components/cast/cast-card';
import { CastCardSkeleton } from '@/components/ui/skeleton';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Zap } from 'lucide-react';
import type { Cast } from '@/lib/types/social';

const TABS = [
  { id: 'for-you',   label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'highlights',label: 'Highlights' },
];

// Mock casts — replace with useCasts() hook wired to contract
const MOCK_CASTS: Cast[] = [
  {
    id: '1',
    author: {
      id: 'u1', username: 'muneeb', displayName: 'Muneeb Ali',
      bio: 'Co-founder @Stacks', avatar: '', walletAddress: 'SP1...',
      followersCount: 42000, followingCount: 800, castsCount: 1200,
      tipsReceived: 5000000, nftsMinted: 3, verified: true, tier: 2,
      joinedAt: '2023-01-01',
    },
    content: 'Bitcoin L2s are going to unlock an entirely new era of decentralized applications. #StacksBTC is leading the way.\n\nThe future is sovereign. 🟠',
    images: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    blockHeight: 142500,
    likesCount: 284,
    recastsCount: 91,
    repliesCount: 47,
    tipsCount: 12,
    tipsTotal: 4750000,
    isLiked: false,
    isRecasted: false,
    isBookmarked: false,
    pinned: true,
  },
  {
    id: '2',
    author: {
      id: 'u2', username: 'satoshi_hiro', displayName: 'Hiro Systems',
      bio: 'Building the tools to build on Stacks', avatar: '', walletAddress: 'SP2...',
      followersCount: 18000, followingCount: 200, castsCount: 430,
      tipsReceived: 2100000, nftsMinted: 0, verified: true, tier: 1,
      joinedAt: '2023-03-15',
    },
    content: 'Just shipped Clarinet v3.0 with blazing-fast contract testing and new devnet support. Try it out and let us know what you think! 🚀\n\n#ClarityLang #Stacks',
    images: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    blockHeight: 142498,
    likesCount: 156,
    recastsCount: 44,
    repliesCount: 23,
    tipsCount: 5,
    tipsTotal: 1500000,
    poll: {
      id: 'p1',
      castId: '2',
      question: 'Which Clarinet feature do you use most?',
      options: [
        { label: 'Contract testing', votes: 142 },
        { label: 'Devnet', votes: 89 },
        { label: 'Check-tool', votes: 34 },
        { label: 'Deploy scripts', votes: 21 },
      ],
      totalVotes: 286,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      closed: false,
    },
    isLiked: true,
    isRecasted: false,
    isBookmarked: true,
  },
  {
    id: '3',
    author: {
      id: 'u3', username: 'clarity_dev', displayName: 'Clarity Dev',
      bio: 'Smart contract engineer', avatar: '', walletAddress: 'SP3...',
      followersCount: 3200, followingCount: 450, castsCount: 890,
      tipsReceived: 800000, nftsMinted: 7, verified: false, tier: 1,
      joinedAt: '2023-06-01',
    },
    content: 'Hot take: Clarity\'s decidability property (no Turing-completeness, no recursion) is actually a *feature*, not a limitation. When your contract can be fully analyzed statically, the whole security model changes.\n\nFewer footguns, better audits. 🔒',
    images: [],
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    blockHeight: 142490,
    likesCount: 98,
    recastsCount: 31,
    repliesCount: 15,
    tipsCount: 8,
    tipsTotal: 3200000,
    nftId: '42',
    isLiked: false,
    isRecasted: false,
    isBookmarked: false,
  },
];

export default function HomePage() {
  const [tab, setTab] = React.useState('for-you');
  const [loading] = React.useState(false);
  const casts = tab === 'for-you' ? MOCK_CASTS : tab === 'following' ? MOCK_CASTS.slice(0, 2) : [];

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Home</h1>
        </div>
        <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="px-0" />
      </header>

      {/* Composer */}
      <CastComposer />

      {/* Feed */}
      <div>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CastCardSkeleton key={i} />)
        ) : casts.length === 0 ? (
          <EmptyState
            icon={<Zap className="w-8 h-8" />}
            title="Nothing here yet"
            description={tab === 'following' ? "Follow people to see their casts here." : "Be the first to cast something!"}
          />
        ) : (
          casts.map(cast => <CastCard key={cast.id} cast={cast} />)
        )}
      </div>

      {/* Load more */}
      {!loading && casts.length > 0 && (
        <div className="py-8 text-center">
          <button className="text-sm text-primary hover:underline">Load more</button>
        </div>
      )}
    </div>
  );
}
