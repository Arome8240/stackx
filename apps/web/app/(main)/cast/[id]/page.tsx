'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Share2, Bookmark, Flag } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeAgo, formatNumber, formatSTX } from '@/lib/utils';
import type { Cast, User } from '@/lib/types/social';

function makeMockAuthor(overrides: Partial<User>): User {
  return {
    id: 'u1',
    username: 'satoshi',
    displayName: 'Satoshi Nakamoto',
    bio: 'Building on Bitcoin',
    avatarUrl: '',
    walletAddress: 'SP1H1733V72HXPTVJXXPQFR7XVX0RJ4B9WKQFMHZP',
    followersCount: 120_000,
    followingCount: 89,
    castsCount: 1_420,
    tipsReceived: 500_000,
    nftsMinted: 42,
    isVerified: true,
    tier: 2,
    joinedAt: '2021-01-01',
    ...overrides,
  };
}

const MOCK_CAST: Cast = {
  id: '1',
  author: makeMockAuthor({}),
  content: 'Just minted my first Cast NFT on StackX! The SIP-009 standard makes it seamless — one transaction and your cast becomes a collectible. #StackX #NFT #Stacks',
  images: [],
  timestamp: new Date(Date.now() - 3600_000 * 2).toISOString(),
  blockHeight: 154_231,
  likesCount: 842,
  recastsCount: 234,
  repliesCount: 56,
  tipsCount: 18,
  tipsTotal: 2_400_000,
  isLiked: false,
  isRecasted: false,
  isBookmarked: false,
  deleted: false,
  pinned: false,
};

const REPLY_AUTHORS: Array<Partial<User>> = [
  { id: 'u2', username: 'clarity_dev', displayName: 'Clarity Dev', tier: 1, isVerified: false },
  { id: 'u3', username: 'stx_maxi', displayName: 'STX Maxi', tier: 0, isVerified: false },
  { id: 'u4', username: 'onchain_grapher', displayName: 'Onchain Grapher', tier: 1, isVerified: true },
  { id: 'u5', username: 'royalty_hunter', displayName: 'Royalty Hunter', tier: 0, isVerified: false },
  { id: 'u6', username: 'sip009_fan', displayName: 'SIP-009 Fan', tier: 2, isVerified: true },
  { id: 'u7', username: 'degen_stacker', displayName: 'Degen Stacker', tier: 0, isVerified: false },
];

const MOCK_REPLIES: Cast[] = Array.from({ length: 6 }, (_, i) => ({
  id: `r${i}`,
  author: makeMockAuthor(REPLY_AUTHORS[i]),
  content: [
    'This is groundbreaking! The integration with Clarity contracts is flawless.',
    'Just followed! The tipping mechanic with 2.5% platform fee is genius.',
    "Been waiting for this. Finally an on-chain social graph that doesn't suck.",
    'What are the secondary royalties set to? 5% right?',
    'The SIP-009 compliance is key — works with all existing Stacks NFT marketplaces.',
    'Insane engagement on this cast. The community is growing fast 🔥',
  ][i],
  images: [],
  timestamp: new Date(Date.now() - 3600_000 * (i + 1)).toISOString(),
  blockHeight: 154_231 - (i + 1) * 3,
  likesCount: Math.floor(Math.random() * 120),
  recastsCount: Math.floor(Math.random() * 30),
  repliesCount: Math.floor(Math.random() * 10),
  tipsCount: 0,
  tipsTotal: 0,
  parentCastId: '1',
  isLiked: false,
  isRecasted: false,
  isBookmarked: false,
  deleted: false,
  pinned: false,
}));

function ReplyCard({ cast }: { cast: Cast }) {
  return (
    <div className="px-4 py-3 border-b border-border/40 hover:bg-white/[0.02] transition-colors">
      <div className="flex gap-3">
        <Avatar size="sm" src={cast.author.avatarUrl} fallback={cast.author.displayName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">@{cast.author.username}</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(cast.timestamp)}</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{cast.content}</p>
          <div className="flex gap-4 mt-2">
            <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {formatNumber(cast.likesCount)} likes
            </button>
            <button className="text-xs text-muted-foreground hover:text-green-400 transition-colors">
              {formatNumber(cast.recastsCount)} recasts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CastDetailPage() {
  useParams<{ id: string }>();
  const router = useRouter();
  const [loading] = React.useState(false);
  const cast = MOCK_CAST;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const stxTipped = formatSTX(cast.tipsTotal);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">Cast</h1>
      </div>

      {/* Cast body */}
      <div className="px-4 py-4 border-b border-border/40">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              size="md"
              src={cast.author.avatarUrl}
              fallback={cast.author.displayName}
              verified={cast.author.isVerified}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground">{cast.author.displayName}</span>
                {cast.author.tier === 2 && (
                  <Badge variant="nft" className="text-xs px-1.5 py-0">Pro</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">@{cast.author.username}</span>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-lg text-foreground leading-relaxed mb-3">{cast.content}</p>

        {/* Timestamp */}
        <div className="text-sm text-muted-foreground mb-3">
          {new Date(cast.timestamp).toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>

        {/* Stats row */}
        <div className="flex gap-5 py-3 border-t border-b border-border/40 mb-3">
          <div className="text-sm">
            <span className="font-bold text-foreground">{formatNumber(cast.recastsCount)}</span>
            <span className="text-muted-foreground ml-1">Recasts</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground">{formatNumber(cast.likesCount)}</span>
            <span className="text-muted-foreground ml-1">Likes</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-foreground">{stxTipped}</span>
            <span className="text-muted-foreground ml-1">STX tipped</span>
          </div>
          {cast.nftId && (
            <div className="text-sm">
              <span className="font-bold text-nft">NFT #{cast.nftId}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-around">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors group p-2">
            <span className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
              💬
            </span>
            <span className="text-sm">{formatNumber(cast.repliesCount)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors group p-2">
            <span className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
              🔁
            </span>
            <span className="text-sm">{formatNumber(cast.recastsCount)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-red-400 transition-colors group p-2">
            <span className="p-2 rounded-full group-hover:bg-red-400/10 transition-colors">
              ❤️
            </span>
            <span className="text-sm">{formatNumber(cast.likesCount)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group p-2">
            <span className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
              ⚡
            </span>
            <span className="text-sm">{cast.tipsCount}</span>
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-red-400 transition-colors p-2">
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reply input */}
      <div className="px-4 py-3 border-b border-border/40 flex gap-3">
        <Avatar size="sm" src="" fallback="Me" />
        <input
          placeholder={`Reply to @${cast.author.username}…`}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button className="btn-primary px-4 py-1.5 text-sm rounded-full">Reply</button>
      </div>

      {/* Replies */}
      <div>
        <div className="px-4 py-2 text-sm font-semibold text-muted-foreground border-b border-border/40">
          {cast.repliesCount} replies
        </div>
        {MOCK_REPLIES.map((reply) => (
          <ReplyCard key={reply.id} cast={reply} />
        ))}
      </div>
    </div>
  );
}
