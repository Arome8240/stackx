'use client';

import * as React from 'react';
import {
  TrendingUp,
  Hash,
  Users,
  MessageSquare,
  Award,
  Clock,
  Zap,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TRENDING_TOPICS = [
  { tag: '#StackX', posts: 8_420, change: 142, trending: true },
  { tag: '#STXtipping', posts: 4_200, change: 89, trending: true },
  { tag: '#CastNFT', posts: 3_100, change: 64, trending: true },
  { tag: '#ClarityLang', posts: 2_800, change: 38, trending: false },
  { tag: '#Bitcoin', posts: 2_400, change: 12, trending: false },
  { tag: '#BitcoinL2', posts: 1_900, change: 55, trending: true },
  { tag: '#StacksBuilders', posts: 1_600, change: 29, trending: false },
  { tag: '#Web3Social', posts: 1_200, change: -8, trending: false },
  { tag: '#NFTMarketplace', posts: 980, change: 22, trending: false },
  { tag: '#Governance', posts: 720, change: 180, trending: true },
];

const TOP_EARNERS = [
  { rank: 1, username: 'satoshi', displayName: 'Satoshi Nakamoto', stxEarned: 45_000, castsCount: 320, tier: 2 },
  { rank: 2, username: 'clarity_dev', displayName: 'Clarity Developer', stxEarned: 32_100, castsCount: 218, tier: 2 },
  { rank: 3, username: 'nft_artist', displayName: 'NFT Artist Pro', stxEarned: 28_400, castsCount: 156, tier: 1 },
  { rank: 4, username: 'btc_maxi', displayName: 'Bitcoin Maximalist', stxEarned: 21_200, castsCount: 89, tier: 1 },
  { rank: 5, username: 'stacks_fan', displayName: 'Stacks Fan', stxEarned: 15_800, castsCount: 412, tier: 1 },
];

const RISING_CREATORS = [
  { username: 'web3_newbie', displayName: 'Web3 Newbie', followersGain: 1_240, followers: 8_400 },
  { username: 'defi_degen', displayName: 'DeFi Degen', followersGain: 890, followers: 5_600 },
  { username: 'stx_dev_42', displayName: 'STX Developer', followersGain: 720, followers: 4_200 },
  { username: 'nft_collector', displayName: 'NFT Collector', followersGain: 540, followers: 3_100 },
];

const maxPosts = TRENDING_TOPICS[0].posts;

export default function TrendsPage() {
  const [period, setPeriod] = React.useState<'1h' | '24h' | '7d'>('24h');

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-400" />
          Trending
        </h1>
        <div className="flex gap-1 p-1 glass rounded-lg">
          {(['1h', '24h', '7d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1 rounded text-xs font-medium transition-colors',
                period === p ? 'bg-violet-500/20 text-violet-300' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Trending hashtags */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-violet-400" />
          Trending Topics
        </h2>
        <div className="space-y-3">
          {TRENDING_TOPICS.map(({ tag, posts, change, trending }, i) => (
            <div key={tag} className="flex items-center gap-3 group cursor-pointer">
              <span className="text-lg font-bold text-muted-foreground w-6 text-right shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="font-medium text-foreground hover:text-violet-400 transition-colors"
                  >
                    {tag}
                  </Link>
                  {trending && (
                    <Badge variant="primary" className="text-xs px-1.5">
                      🔥
                    </Badge>
                  )}
                </div>
                <Progress
                  value={posts}
                  max={maxPosts}
                  size="sm"
                  color={trending ? 'violet' : 'blue'}
                  className="w-full"
                />
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-medium text-foreground">{formatNumber(posts)}</div>
                <div className={cn('text-xs flex items-center gap-0.5 justify-end', change >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {change >= 0 ? '+' : ''}{change}%
                  <ArrowUpRight className={cn('w-3 h-3', change < 0 && 'rotate-90')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top earners */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-violet-400" />
          Top STX Earners
        </h2>
        <div className="space-y-3">
          {TOP_EARNERS.map(({ rank, username, displayName, stxEarned, castsCount, tier }) => {
            const medalColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <div key={username} className="flex items-center gap-3 hover:bg-white/[0.03] rounded-xl p-2 transition-colors">
                <span className="text-lg w-8 text-center">{rank <= 3 ? medals[rank - 1] : rank}</span>
                <Avatar size="sm" src="" fallback={displayName} verified={tier === 2} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/profile/${username}`} className="font-medium text-sm text-foreground hover:text-violet-400 transition-colors">
                      {displayName}
                    </Link>
                    {tier === 2 && <Badge variant="nft" className="text-xs px-1.5">Pro</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">{castsCount} casts</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm gradient-text">{formatNumber(stxEarned)} STX</div>
                  <div className="text-xs text-muted-foreground">earned</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rising creators */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-violet-400" />
          Rising Creators
          <span className="text-xs text-muted-foreground font-normal ml-1">fastest growing</span>
        </h2>
        <div className="space-y-3">
          {RISING_CREATORS.map(({ username, displayName, followersGain, followers }) => (
            <div key={username} className="flex items-center gap-3 hover:bg-white/[0.03] rounded-xl p-2 transition-colors">
              <Avatar size="sm" src="" fallback={displayName} />
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${username}`} className="font-medium text-sm text-foreground hover:text-violet-400 transition-colors block">
                  {displayName}
                </Link>
                <div className="text-xs text-muted-foreground">{formatNumber(followers)} followers</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-400">+{formatNumber(followersGain)}</div>
                <div className="text-xs text-muted-foreground">this week</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global activity */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-violet-400" />
          Platform Activity
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Casts today', value: '8,420', icon: MessageSquare, change: '+12%' },
            { label: 'Active users', value: '3,200', icon: Users, change: '+8%' },
            { label: 'STX tipped', value: '42,100', icon: Zap, change: '+24%' },
            { label: 'NFTs minted', value: '184', icon: Award, change: '+36%' },
          ].map(({ label, value, icon: Icon, change }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-white/[0.02]">
              <Icon className="w-4 h-4 text-violet-400 mx-auto mb-2" />
              <div className="font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-xs text-green-400 mt-0.5">{change}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
