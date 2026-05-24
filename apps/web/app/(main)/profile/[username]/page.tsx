'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  MapPin, Link as LinkIcon, Calendar, CheckCircle,
  Settings, Gem, Coins, ArrowLeft,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { CastCard } from '@/components/cast/cast-card';
import { CastCardSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { formatNumber, formatSTX, formatTimeAgo } from '@/lib/utils';
import type { User, Cast } from '@/lib/types/social';

const PROFILE_TABS = [
  { id: 'casts',   label: 'Casts' },
  { id: 'replies', label: 'Replies' },
  { id: 'media',   label: 'Media' },
  { id: 'likes',   label: 'Likes' },
  { id: 'nfts',    label: 'NFTs' },
];

const MOCK_USER: User = {
  id: 'u1', username: 'muneeb', displayName: 'Muneeb Ali',
  bio: 'Co-founder @Stacks. Building the Bitcoin economy.',
  website: 'stacks.co', location: 'New York, NY',
  avatar: '', banner: '',
  walletAddress: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  followersCount: 42000, followingCount: 800, castsCount: 1200,
  tipsReceived: 24750000, nftsMinted: 3,
  verified: true, tier: 2,
  joinedAt: '2023-01-15',
};

const MOCK_CASTS: Cast[] = [
  {
    id: '1', author: MOCK_USER,
    content: 'Bitcoin L2s are going to unlock an entirely new era of decentralized applications. #StacksBTC\n\nThe future is sovereign. 🟠',
    images: [], timestamp: new Date(Date.now() - 720000).toISOString(),
    blockHeight: 142500, likesCount: 284, recastsCount: 91, repliesCount: 47,
    tipsCount: 12, tipsTotal: 4750000,
  },
];

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [tab, setTab] = React.useState('casts');
  const [following, setFollowing] = React.useState(false);
  const [loading] = React.useState(false);
  const user = MOCK_USER;
  const isOwnProfile = false;

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1.5 rounded-full hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-base leading-tight">{user.displayName}</h1>
          <p className="text-xs text-muted-foreground">{formatNumber(user.castsCount)} casts</p>
        </div>
      </header>

      {/* Banner */}
      <div className="relative h-36 bg-gradient-to-br from-violet-900/60 via-fuchsia-900/40 to-purple-900/60">
        {user.banner && <img src={user.banner} alt="" className="w-full h-full object-cover" />}
      </div>

      {/* Profile info */}
      <div className="relative px-4 pb-4">
        <div className="flex items-end justify-between -mt-10 mb-3">
          <Avatar src={user.avatar} alt={user.displayName} size="2xl" verified={user.verified} className="ring-4 ring-background" />
          <div className="flex items-center gap-2 mb-1">
            {isOwnProfile ? (
              <Button variant="outline" size="sm" icon={<Settings className="w-4 h-4" />}>Edit profile</Button>
            ) : (
              <>
                <Button variant="outline" size="sm">Message</Button>
                <Button size="sm" variant={following ? 'outline' : 'primary'} onClick={() => setFollowing(v => !v)}>
                  {following ? 'Following' : 'Follow'}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 mb-1">
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          {user.verified && <CheckCircle className="w-5 h-5 text-primary fill-primary" />}
          {user.tier === 2 && <Badge variant="nft">Creator</Badge>}
          {user.tier >= 1 && <Badge variant="primary">Pro</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mb-3">@{user.username}</p>
        {user.bio && <p className="text-sm leading-relaxed mb-3">{user.bio}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-sm text-muted-foreground">
          {user.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{user.location}</span>}
          {user.website && (
            <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
              <LinkIcon className="w-3.5 h-3.5" />{user.website}
            </a>
          )}
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {formatTimeAgo(user.joinedAt)}</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { label: 'Following',   value: formatNumber(user.followingCount) },
            { label: 'Followers',   value: formatNumber(user.followersCount) },
            { label: 'Tips rcvd',   value: formatSTX(user.tipsReceived),   icon: <Coins className="w-3.5 h-3.5 text-yellow-500" /> },
            { label: 'NFTs minted', value: String(user.nftsMinted),        icon: <Gem   className="w-3.5 h-3.5 text-fuchsia-400" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center gap-1">
              {icon}
              <span className="font-semibold text-sm">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs font-mono text-muted-foreground truncate">
          {user.walletAddress}
        </div>
      </div>

      <Tabs tabs={PROFILE_TABS} activeTab={tab} onChange={setTab} />

      <div>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <CastCardSkeleton key={i} />)
        ) : tab === 'casts' ? (
          MOCK_CASTS.map(cast => <CastCard key={cast.id} cast={cast} />)
        ) : tab === 'nfts' ? (
          <NftGrid />
        ) : (
          <EmptyState title={`No ${tab} yet`} description={`@${username} hasn't posted any ${tab} yet.`} />
        )}
      </div>
    </div>
  );
}

function NftGrid() {
  const nfts = [
    { id: '42', name: 'Cast #42', edition: '1/10', price: '5 STX' },
    { id: '17', name: 'Cast #17', edition: '3/5',  price: '12 STX' },
    { id: '8',  name: 'Cast #8',  edition: '1/1',  price: '50 STX' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {nfts.map(nft => (
        <div key={nft.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-fuchsia-500/40 transition-colors">
          <div className="aspect-square bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
            <Gem className="w-12 h-12 text-fuchsia-400 opacity-60" />
          </div>
          <div className="p-3 space-y-1">
            <p className="text-sm font-semibold">{nft.name}</p>
            <div className="flex items-center justify-between">
              <Badge variant="nft">{nft.edition}</Badge>
              <span className="text-xs font-semibold text-yellow-500">{nft.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
