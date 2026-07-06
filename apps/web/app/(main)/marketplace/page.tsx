'use client';

import * as React from 'react';
import {
  Search,
  Grid3X3,
  List,
  TrendingUp,
  Filter,
  ShoppingBag,
  Tag,
  Award,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { formatNumber, formatSTX } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { NFTListing } from '@/lib/types/social';

const MOCK_LISTINGS: (NFTListing & { castPreview: string; seller: { username: string; avatarUrl: string; isVerified: boolean } })[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `nft-${i}`,
    castId: i,
    seller: {
      username: ['satoshi', 'nakamoto', 'vitalik', 'stacks_dev', 'clarity_coder', 'bitcoin_max'][i % 6],
      avatarUrl: '',
      isVerified: i % 3 === 0,
    },
    castPreview: [
      'Just shipped the SIP-009 NFT trait on StackX 🚀',
      'The future of social is on-chain. No more siloed data.',
      'Bitcoin L2s are inevitable. Stacks is winning.',
      'Clarity is the most secure smart contract language. Period.',
      'Web3 social will eat Web2 social. The incentives are right.',
      'STX tipping is live! Support creators directly on-chain.',
    ][i % 6],
    priceStx: [10, 25, 5, 100, 50, 15, 200, 8, 35, 75, 12, 300][i],
    edition: i % 4 === 0 ? 1 : Math.floor(Math.random() * 10) + 1,
    maxEdition: [1, 10, 5, 1, 10, 3, 1, 10, 5, 1, 10, 1][i],
    tokenUri: `ipfs://Qm${Math.random().toString(36).slice(2)}`,
    isListed: true,
    createdAt: new Date(Date.now() - 86400_000 * i).toISOString(),
  }),
);

const STATS = [
  { label: 'Floor Price', value: '5 STX', icon: Tag },
  { label: 'Total Volume', value: '8,900 STX', icon: TrendingUp },
  { label: 'Listed NFTs', value: '1,284', icon: ShoppingBag },
  { label: 'Unique Owners', value: '342', icon: Award },
];

type FilterTab = 'all' | 'rare' | 'recent' | 'trending';

function NFTCard({
  listing,
}: {
  listing: (typeof MOCK_LISTINGS)[0];
}) {
  const isOneOfOne = listing.maxEdition === 1;
  const rarityLabel = isOneOfOne ? '1/1' : `${listing.edition}/${listing.maxEdition}`;

  return (
    <div className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-lg cursor-pointer">
      {/* NFT preview */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <p className="text-center text-sm text-foreground/80 leading-relaxed font-medium line-clamp-4">
            {listing.castPreview}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3">
          <Badge variant={isOneOfOne ? 'nft' : 'default'} className="text-xs">
            {rarityLabel}
          </Badge>
        </div>
        {listing.seller.isVerified && (
          <div className="absolute top-3 left-3">
            <Badge variant="primary" className="text-xs px-1.5">✓ Verified</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-full btn-primary py-2 text-sm rounded-xl">
            Buy for {listing.priceStx} STX
          </button>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar size="xs" src={listing.seller.avatarUrl} fallback={listing.seller.username} />
            <span className="text-xs text-muted-foreground">@{listing.seller.username}</span>
          </div>
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="font-bold text-sm text-primary">{listing.priceStx} STX</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Cast NFT</div>
            <div className="text-xs text-muted-foreground">#{listing.id.replace('nft-', '')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NFTRow({ listing }: { listing: (typeof MOCK_LISTINGS)[0] }) {
  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-nft/10 flex items-center justify-center flex-shrink-0">
        <Zap className="w-4 h-4 text-nft" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{listing.castPreview}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Avatar size="xs" src={listing.seller.avatarUrl} fallback={listing.seller.username} />
          <span className="text-xs text-muted-foreground">@{listing.seller.username}</span>
          <Badge variant="default" className="text-xs">
            {listing.edition}/{listing.maxEdition}
          </Badge>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-sm text-primary">{listing.priceStx} STX</div>
        <button className="text-xs text-primary hover:text-primary/80 mt-0.5 transition-colors">
          Buy now
        </button>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [tab, setTab] = React.useState<FilterTab>('all');
  const [sortBy, setSortBy] = React.useState<'price-asc' | 'price-desc' | 'recent'>('recent');

  const filtered = React.useMemo(() => {
    let list = [...MOCK_LISTINGS];
    if (query) list = list.filter((l) => l.castPreview.toLowerCase().includes(query.toLowerCase()));
    if (tab === 'rare') list = list.filter((l) => l.maxEdition === 1);
    if (tab === 'trending') list = list.sort((a, b) => b.priceStx - a.priceStx);
    if (sortBy === 'price-asc') list = list.sort((a, b) => a.priceStx - b.priceStx);
    if (sortBy === 'price-desc') list = list.sort((a, b) => b.priceStx - a.priceStx);
    return list;
  }, [query, tab, sortBy]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All NFTs' },
    { key: 'rare', label: '1/1 Rare' },
    { key: 'recent', label: 'Recent' },
    { key: 'trending', label: 'Trending' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">NFT Marketplace</h1>
        </div>
        <p className="text-muted-foreground">Buy and sell Cast NFTs minted on the Stacks blockchain</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className="font-bold text-lg text-primary">{value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NFTs by cast content…"
            className="input-base w-full pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-base text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 glass rounded-xl w-fit">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              tab === key
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mb-4">
        {filtered.length} listings
      </div>

      {/* Grid or List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <NFTCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((listing) => (
            <NFTRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No NFTs found</h3>
          <p className="text-muted-foreground">Try a different search or filter</p>
        </div>
      )}
    </div>
  );
}
