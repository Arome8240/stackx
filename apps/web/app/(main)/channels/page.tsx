'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Lock, Users, Hash, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { formatNumber, formatSTX } from '@/lib/utils';
import type { Channel } from '@/lib/types/social';

const TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'joined',   label: 'Joined' },
  { id: 'new',      label: 'New' },
];

const MOCK_CHANNELS: Channel[] = [
  {
    id: '1', name: 'stacks', description: 'All things Stacks blockchain — tech, community, and ecosystem updates.',
    image: '', creator: 'muneeb', isPaid: false, entryFee: 0,
    membersCount: 12400, castsCount: 8900, revenueTotal: 0,
    isNsfw: false, isPrivate: false, createdAt: '2023-01-01', isMember: true,
  },
  {
    id: '2', name: 'clarity-lang', description: 'Clarity smart contract development, patterns, and best practices.',
    image: '', creator: 'satoshi_hiro', isPaid: false, entryFee: 0,
    membersCount: 4200, castsCount: 3100, revenueTotal: 0,
    isNsfw: false, isPrivate: false, createdAt: '2023-02-15', isMember: false,
  },
  {
    id: '3', name: 'nft-alpha', description: '🔒 Premium NFT alpha — early drops, whale moves, market analysis.',
    image: '', creator: 'punk6529', isPaid: true, entryFee: 10000000,
    membersCount: 890, castsCount: 2400, revenueTotal: 8900000000,
    isNsfw: false, isPrivate: true, createdAt: '2023-04-10', isMember: false,
  },
  {
    id: '4', name: 'defi-stacks', description: 'DeFi protocols, yield strategies, and liquidity on Stacks.',
    image: '', creator: 'defi_alice', isPaid: false, entryFee: 0,
    membersCount: 6700, castsCount: 5200, revenueTotal: 0,
    isNsfw: false, isPrivate: false, createdAt: '2023-03-01', isMember: true,
  },
  {
    id: '5', name: 'btc-maxis', description: 'Bitcoin maximalism, monetary theory, and sound money.',
    image: '', creator: 'satoshi2140', isPaid: false, entryFee: 0,
    membersCount: 22000, castsCount: 18000, revenueTotal: 0,
    isNsfw: false, isPrivate: false, createdAt: '2022-12-01', isMember: false,
  },
];

export default function ChannelsPage() {
  const [tab, setTab] = React.useState('trending');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [joinOpen, setJoinOpen] = React.useState<Channel | null>(null);
  const [query, setQuery] = React.useState('');
  const [form, setForm] = React.useState({ name: '', description: '', isPaid: false, entryFee: '' });

  const filtered = MOCK_CHANNELS.filter(c =>
    c.name.includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  const display = tab === 'joined'
    ? filtered.filter(c => c.isMember)
    : tab === 'new'
    ? [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [...filtered].sort((a, b) => b.membersCount - a.membersCount);

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Channels</h1>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
            Create
          </Button>
        </div>
        <div className="px-4 pb-3">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search channels…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Tabs tabs={TABS} activeTab={tab} onChange={setTab} className="px-0" />
      </header>

      {/* Channel list */}
      <div className="divide-y divide-border">
        {display.length === 0 ? (
          <EmptyState icon={<Hash className="w-8 h-8" />} title="No channels found" description="Try a different search or create one." />
        ) : (
          display.map(channel => (
            <ChannelCard key={channel.id} channel={channel} onJoin={() => setJoinOpen(channel)} />
          ))
        )}
      </div>

      {/* Create Channel Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <ModalHeader title="Create Channel" onClose={() => setCreateOpen(false)} />
        <ModalBody className="space-y-4">
          <Input
            label="Channel name"
            placeholder="e.g. clarity-devs"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
            hint="Lowercase letters, numbers, and hyphens only."
          />
          <Textarea
            label="Description"
            placeholder="What is this channel about?"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            showCount
            maxLength={500}
          />
          <div className="flex items-center justify-between p-4 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium">Paid channel</p>
              <p className="text-xs text-muted-foreground">Require STX to join. You keep 90%.</p>
            </div>
            <button
              onClick={() => setForm(f => ({ ...f, isPaid: !f.isPaid }))}
              className={`w-11 h-6 rounded-full transition-colors ${form.isPaid ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-1 ${form.isPaid ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          {form.isPaid && (
            <Input
              label="Entry fee (STX)"
              type="number"
              placeholder="10"
              min="0.1"
              value={form.entryFee}
              onChange={e => setForm(f => ({ ...f, entryFee: e.target.value }))}
              hint="Minimum 0.1 STX"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button disabled={!form.name || form.name.length < 2}>Create Channel</Button>
        </ModalFooter>
      </Modal>

      {/* Join Paid Channel Modal */}
      {joinOpen && (
        <Modal open={!!joinOpen} onClose={() => setJoinOpen(null)} size="sm">
          <ModalHeader title="Join Paid Channel" onClose={() => setJoinOpen(null)} />
          <ModalBody className="space-y-4">
            <div className="flex items-center gap-3">
              <ChannelIcon name={joinOpen.name} />
              <div>
                <p className="font-semibold">/{joinOpen.name}</p>
                <p className="text-sm text-muted-foreground">{formatNumber(joinOpen.membersCount)} members</p>
              </div>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entry fee</span>
                <span className="font-semibold">{formatSTX(joinOpen.entryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Creator receives</span>
                <span className="text-green-500">{formatSTX(joinOpen.entryFee * 0.9)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform fee (10%)</span>
                <span>{formatSTX(joinOpen.entryFee * 0.1)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Payment is processed on-chain via the StackX smart contract. Non-refundable.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setJoinOpen(null)}>Cancel</Button>
            <Button icon={<Lock className="w-4 h-4" />}>
              Pay & Join
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}

function ChannelCard({ channel, onJoin }: { channel: Channel; onJoin: () => void }) {
  return (
    <div className="flex items-start gap-4 px-4 py-4 hover:bg-accent/30 transition-colors">
      <ChannelIcon name={channel.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Link href={`/channels/${channel.name}`} className="font-semibold hover:underline text-sm">
            /{channel.name}
          </Link>
          {channel.isPrivate && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
          {channel.isPaid && <Badge variant="warning">Paid</Badge>}
          {channel.isMember && <Badge variant="success">Joined</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{channel.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{formatNumber(channel.membersCount)}</span>
          <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{formatNumber(channel.castsCount)} casts</span>
          {channel.isPaid && <span className="flex items-center gap-1 text-yellow-500"><TrendingUp className="w-3.5 h-3.5" />{formatSTX(channel.revenueTotal)} earned</span>}
        </div>
      </div>
      {!channel.isMember && (
        <Button
          size="sm"
          variant={channel.isPaid ? 'primary' : 'outline'}
          onClick={onJoin}
          icon={channel.isPaid ? <Lock className="w-3.5 h-3.5" /> : undefined}
        >
          {channel.isPaid ? formatSTX(channel.entryFee) : 'Join'}
        </Button>
      )}
    </div>
  );
}

function ChannelIcon({ name }: { name: string }) {
  const colors = [
    'from-primary/80 to-primary',
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-accent-foreground/80 to-accent-foreground',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
      <span className="text-white font-bold text-sm">{name[0].toUpperCase()}</span>
    </div>
  );
}
