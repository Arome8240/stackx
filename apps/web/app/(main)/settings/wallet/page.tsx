'use client';

import { Wallet, ExternalLink, Shield, Key } from 'lucide-react';
import { useWallet, useSTXBalance } from '@/lib/hooks/use-wallet';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { formatSTX } from '@/lib/utils';

export default function WalletSettingsPage() {
  const { address, connected } = useWallet();
  const { data: liveBalance } = useSTXBalance(address);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary" />
        Wallet Settings
      </h1>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Wallet</h2>
        {connected && address ? (
          <>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border/40">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground truncate">
                    {address.slice(0, 10)}…{address.slice(-8)}
                  </span>
                  <CopyButton text={address} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Stacks Testnet</p>
              </div>
              <Badge variant="primary" className="shrink-0">Active</Badge>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] text-center">
              <p className="text-xs text-muted-foreground">STX Balance</p>
              <p className="font-bold text-sm text-primary mt-1">{formatSTX(liveBalance ?? 0)}</p>
            </div>

            <a
              href={`https://explorer.hiro.so/address/${address}?chain=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Sign in to see your wallet.</p>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security
        </h2>
        <p className="text-xs text-muted-foreground">
          StackX creates and manages a Stacks wallet for your account automatically. Your private key is
          encrypted and stored securely — StackX signs transactions on your behalf, so there's no browser
          extension or seed phrase to manage.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { label: 'Wallet custody', value: 'Managed by StackX' },
            { label: 'Private key', value: 'Encrypted at rest' },
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
