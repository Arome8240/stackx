'use client';

import * as React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Gem, Coins, TrendingUp, Copy, ExternalLink, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { formatSTX, formatNumber, formatTimeAgo, shortenAddress, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'activity',  label: 'Activity' },
  { id: 'nfts',      label: 'NFTs' },
  { id: 'tips',      label: 'Tips' },
];

const STX_BALANCE   = 1_284_500_000; // microSTX
const TIPS_RECEIVED = 24_750_000;
const TIPS_SENT     = 8_000_000;

const TX_HISTORY = [
  { id: 'tx1', type: 'tip-received', from: 'punk6529',     amount: 5_000_000, timestamp: new Date(Date.now() - 300_000).toISOString(),   status: 'confirmed' },
  { id: 'tx2', type: 'channel-join', to:   'nft-alpha',    amount: 10_000_000, timestamp: new Date(Date.now() - 3_600_000).toISOString(), status: 'confirmed' },
  { id: 'tx3', type: 'tip-sent',     to:   'muneeb',       amount: 2_000_000, timestamp: new Date(Date.now() - 7_200_000).toISOString(),  status: 'confirmed' },
  { id: 'tx4', type: 'nft-sale',     buyer:'satoshi_hiro', amount: 12_000_000, timestamp: new Date(Date.now() - 86_400_000).toISOString(), status: 'confirmed' },
  { id: 'tx5', type: 'tip-received', from: 'dave',         amount: 1_000_000, timestamp: new Date(Date.now() - 172_800_000).toISOString(), status: 'confirmed' },
];

const NFT_HOLDINGS = [
  { id: '7',  name: 'Cast #7 by @muneeb',  edition: '1/1',  value: 50_000_000 },
  { id: '23', name: 'Cast #23 by @hiro',   edition: '2/5',  value: 8_000_000  },
  { id: '89', name: 'Cast #89 by @alice',  edition: '1/10', value: 3_000_000  },
];

const WALLET_ADDR = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ';

export default function WalletPage() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState('overview');

  const copyAddr = () => {
    copyToClipboard(WALLET_ADDR);
    toast({ type: 'success', title: 'Address copied!' });
  };

  return (
    <div className="max-w-[640px] mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Wallet</h1>
          <Button variant="ghost" size="icon" aria-label="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Balance hero */}
      <div className="bg-muted border-b border-border p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            <p className="text-4xl font-bold tracking-tight">{formatSTX(STX_BALANCE)}</p>
            <p className="text-sm text-muted-foreground mt-1">≈ ${((STX_BALANCE / 1_000_000) * 2.14).toFixed(2)} USD</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Wallet address */}
        <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2 mb-5">
          <code className="flex-1 text-xs font-mono text-muted-foreground truncate">{shortenAddress(WALLET_ADDR, 8)}</code>
          <button onClick={copyAddr} className="text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <a href={`https://explorer.stacks.co/address/${WALLET_ADDR}?chain=testnet`} target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Send className="w-5 h-5" />,          label: 'Send',    color: 'bg-primary/20 text-primary' },
            { icon: <ArrowDownLeft className="w-5 h-5" />, label: 'Receive', color: 'bg-green-500/20 text-green-500' },
            { icon: <TrendingUp className="w-5 h-5" />,    label: 'Earn',    color: 'bg-yellow-500/20 text-yellow-500' },
          ].map(({ icon, label, color }) => (
            <button key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <span className={cn('w-10 h-10 rounded-full flex items-center justify-center', color)}>{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          { label: 'Tips Received', value: formatSTX(TIPS_RECEIVED), icon: <ArrowDownLeft className="w-3.5 h-3.5 text-green-500" /> },
          { label: 'Tips Sent',     value: formatSTX(TIPS_SENT),     icon: <ArrowUpRight  className="w-3.5 h-3.5 text-red-500" /> },
          { label: 'NFTs Held',     value: formatNumber(NFT_HOLDINGS.length), icon: <Gem className="w-3.5 h-3.5 text-nft" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-4 px-2">
            <div className="flex items-center gap-1">{icon}<span className="text-base font-bold">{value}</span></div>
            <span className="text-xs text-muted-foreground text-center">{label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {/* Tab content */}
      <div>
        {tab === 'overview' && (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-1">
              {TX_HISTORY.slice(0, 3).map(tx => <TxItem key={tx.id} tx={tx} />)}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setTab('activity')}>
              View all activity
            </Button>
          </div>
        )}

        {tab === 'activity' && (
          <div className="divide-y divide-border">
            {TX_HISTORY.map(tx => <TxItem key={tx.id} tx={tx} padded />)}
          </div>
        )}

        {tab === 'nfts' && (
          <div>
            {NFT_HOLDINGS.length === 0 ? (
              <EmptyState icon={<Gem className="w-8 h-8" />} title="No NFTs yet" description="Buy or collect cast NFTs from the marketplace." />
            ) : (
              <div className="grid grid-cols-2 gap-3 p-4">
                {NFT_HOLDINGS.map(nft => (
                  <div key={nft.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-nft/30 transition-colors">
                    <div className="aspect-square bg-nft/10 flex items-center justify-center">
                      <Gem className="w-12 h-12 text-nft opacity-60" />
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-semibold line-clamp-1">{nft.name}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="nft">{nft.edition}</Badge>
                        <span className="text-xs font-semibold text-yellow-500">{formatSTX(nft.value)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'tips' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <Coins className="w-5 h-5 text-green-500 mb-2" />
                <p className="text-xl font-bold">{formatSTX(TIPS_RECEIVED)}</p>
                <p className="text-xs text-muted-foreground">Total received</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <Send className="w-5 h-5 text-red-500 mb-2" />
                <p className="text-xl font-bold">{formatSTX(TIPS_SENT)}</p>
                <p className="text-xs text-muted-foreground">Total sent</p>
              </div>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {TX_HISTORY.filter(tx => tx.type.startsWith('tip')).map(tx => <TxItem key={tx.id} tx={tx} padded />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type TxData = typeof TX_HISTORY[number];

function TxItem({ tx, padded }: { tx: TxData; padded?: boolean }) {
  const isIn = tx.type === 'tip-received' || tx.type === 'nft-sale';
  const label = {
    'tip-received': `Tip from @${(tx as { from?: string }).from}`,
    'tip-sent':     `Tip to @${(tx as { to?: string }).to}`,
    'channel-join': `Joined /${(tx as { to?: string }).to}`,
    'nft-sale':     `NFT sold to @${(tx as { buyer?: string }).buyer}`,
  }[tx.type] ?? tx.type;

  return (
    <div className={cn('flex items-center gap-3 hover:bg-accent/30 transition-colors', padded ? 'px-4 py-3.5' : 'py-2')}>
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0',
        isIn ? 'bg-green-500/10' : 'bg-red-500/10'
      )}>
        {isIn
          ? <ArrowDownLeft className="w-4 h-4 text-green-500" />
          : <ArrowUpRight  className="w-4 h-4 text-red-500" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        <p className="text-xs text-muted-foreground">{formatTimeAgo(tx.timestamp)}</p>
      </div>
      <div className="text-right">
        <p className={cn('text-sm font-semibold', isIn ? 'text-green-500' : 'text-red-500')}>
          {isIn ? '+' : '-'}{formatSTX(tx.amount)}
        </p>
        <Badge variant={tx.status === 'confirmed' ? 'success' : 'warning'} className="text-[10px]">
          {tx.status}
        </Badge>
      </div>
    </div>
  );
}
