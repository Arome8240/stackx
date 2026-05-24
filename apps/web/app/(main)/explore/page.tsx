'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hash, Flame, Users, TrendingUp } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { formatNumber, formatSTX } from '@/lib/utils';

const TABS = [
  { id: 'trending', label: 'Trending', icon: <Flame  className="w-3.5 h-3.5" /> },
  { id: 'people',   label: 'People',   icon: <Users  className="w-3.5 h-3.5" /> },
  { id: 'earning',  label: 'Earning',  icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

const TOP_CREATORS = [
  { username: 'muneeb',       displayName: 'Muneeb Ali',   avatar: '', verified: true,  tier: 2 as const, tipsTotal: 24_750_000, followers: 42000 },
  { username: 'satoshi_hiro', displayName: 'Hiro Systems', avatar: '', verified: true,  tier: 1 as const, tipsTotal: 18_200_000, followers: 18000 },
  { username: 'clarity_dev',  displayName: 'Clarity Dev',  avatar: '', verified: false, tier: 1 as const, tipsTotal: 9_500_000,  followers: 3200  },
  { username: 'punk6529',     displayName: 'punk6529',     avatar: '', verified: false, tier: 0 as const, tipsTotal: 7_200_000,  followers: 8900  },
];

const TRENDING_TOPICS = [
  { tag: '#StacksBTC',   posts: 2840, change: '+12%' },
  { tag: '#ClarityLang', posts: 1205, change: '+8%'  },
  { tag: '#DeSo',        posts: 980,  change: '+31%' },
  { tag: '#Web3Social',  posts: 754,  change: '+5%'  },
  { tag: '#NFTDrop',     posts: 612,  change: '-2%'  },
  { tag: '#BitcoinL2',   posts: 540,  change: '+19%' },
];

export default function ExplorePage() {
  const [tab, setTab] = React.useState('trending');

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3 flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Explore</h1>
        </div>
        <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="px-0" />
      </header>

      {tab === 'trending' && (
        <div className="px-4 py-4 space-y-1">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Trending Topics</h2>
          {TRENDING_TOPICS.map(({ tag, posts, change }, i) => (
            <Link key={tag} href={"/search?q=" + encodeURIComponent(tag)}
              className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-accent/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-muted-foreground text-right">{i + 1}</span>
                <div>
                  <p className="font-semibold text-sm">{tag}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(posts)} casts</p>
                </div>
              </div>
              <span className={"text-xs font-semibold " + (change.startsWith('+') ? 'text-green-500' : 'text-red-500')}>
                {change}
              </span>
            </Link>
          ))}
        </div>
      )}

      {tab === 'people' && (
        <div className="divide-y divide-border">
          {TOP_CREATORS.map((user, i) => (
            <div key={user.username} className="flex items-center gap-3 px-4 py-4 hover:bg-accent/30 transition-colors">
              <span className="w-5 text-sm font-bold text-muted-foreground">{i + 1}</span>
              <Link href={"/profile/" + user.username}>
                <Avatar src={user.avatar} alt={user.displayName} size="md" verified={user.verified} />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link href={"/profile/" + user.username} className="font-semibold text-sm hover:underline">
                    {user.displayName}
                  </Link>
                  {user.tier === 2 && <Badge variant="nft" className="text-[10px]">Creator</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{formatNumber(user.followers)} followers</p>
              </div>
              <Button size="xs" variant="outline">Follow</Button>
            </div>
          ))}
        </div>
      )}

      {tab === 'earning' && (
        <div className="px-4 py-4 space-y-2">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Top Earners</h2>
          {TOP_CREATORS.sort((a, b) => b.tipsTotal - a.tipsTotal).map((user, i) => (
            <div key={user.username} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors">
              <span className="w-6 text-center font-bold">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1)}
              </span>
              <Avatar src={user.avatar} alt={user.displayName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-500">{formatSTX(user.tipsTotal)}</p>
                <p className="text-xs text-muted-foreground">earned</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
