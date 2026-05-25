'use client';

import * as React from 'react';
import { Wallet, Copy, ExternalLink, Zap, Shield, Key } from 'lucide-react';
import { useWallet } from '@/lib/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { formatSTX } from '@/lib/utils';

export default function WalletSettingsPage() {
  const { address, balance, isConnected, connect, disconnect } = useWallet();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Wallet className="w-5 h-5 text-violet-400" />
        Wallet Settings
      </h1>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Connected Wallet</h2>
        {isConnected ? (
          <>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border/40">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground truncate">
                    {address?.slice(0, 10)}…{address?.slice(-8)}
                  </span>
                  <CopyButton text={address ?? ''} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Stacks Mainnet</p>
              </div>
              <Badge variant="primary" className="shrink-0">Connected</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] text-center">
                <p className="text-xs text-muted-foreground">STX Balance</p>
                <p className="font-bold text-sm gradient-text mt-1">{formatSTX(balance?.stx?.balance ?? 0)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] text-center">
                <p className="text-xs text-muted-foreground">BTC Balance</p>
                <p className="font-bold text-sm text-orange-400 mt-1">{balance?.btc?.balance ?? '—'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                as="a"
                href={`https://explorer.hiro.so/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </Button>
              <Button variant="danger" size="sm" onClick={disconnect} className="flex-1">
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-violet-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Connect your Stacks wallet to tip creators, mint Cast NFTs, and participate in governance</p>
            <Button variant="primary" onClick={connect}>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security
        </h2>
        <p className="text-xs text-muted-foreground">
          StackX never stores your private keys. All transactions are signed locally in your wallet and broadcast to the Stacks network.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { label: 'Private key', value: 'Never stored' },
            { label: 'Transaction signing', value: 'Local only' },
            { label: 'STX tipping', value: 'On-chain' },
            { label: 'NFT minting', value: 'On-chain' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs py-1.5 border-b border-border/20 last:border-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-green-400 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
