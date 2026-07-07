'use client';

import * as React from 'react';
import { Gem, AlertCircle, Shield } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { formatNumber, formatSTX } from '@/lib/utils';

interface BuyNftModalProps {
  tokenId: number;
  priceStx: number;
  creatorUsername?: string;
  edition?: number;
  maxEdition?: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BuyNftModal({ tokenId, priceStx, creatorUsername, edition, maxEdition, open, onClose, onSuccess }: BuyNftModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const platformFee = priceStx * 0.025;
  const royaltyFee = priceStx * 0.05;

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/nfts/${tokenId}/buy`);
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Purchase NFT" size="sm">
      <div className="space-y-4">
        <div className="text-center p-4 rounded-xl bg-nft/10 border border-nft/20">
          <Gem className="w-10 h-10 text-nft mx-auto mb-2" />
          <p className="font-bold text-nft text-xl">{formatNumber(priceStx)} STX</p>
          <p className="text-xs text-muted-foreground">Cast NFT #{tokenId}</p>
          {edition && maxEdition && (
            <p className="text-xs text-muted-foreground">Edition {edition}/{maxEdition}</p>
          )}
          {creatorUsername && (
            <p className="text-xs text-muted-foreground mt-1">by @{creatorUsername}</p>
          )}
        </div>

        <div className="space-y-1 p-3 rounded-xl bg-white/[0.02]">
          {[
            { label: 'NFT price', amount: priceStx },
            { label: 'Platform fee (2.5%)', amount: -platformFee },
            { label: 'Creator royalty (5%)', amount: -royaltyFee },
          ].map(({ label, amount }) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className={amount < 0 ? 'text-red-400' : 'text-foreground'}>
                {amount < 0 ? '-' : ''}{formatSTX(Math.abs(amount))}
              </span>
            </div>
          ))}
          <div className="border-t border-border/40 mt-2 pt-2 flex justify-between text-sm font-bold">
            <span>You pay</span>
            <span className="text-nft">{formatSTX(priceStx)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span>Transaction secured by the Stacks blockchain</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <Button variant="primary" onClick={handleBuy} loading={loading} className="w-full">
          <Gem className="w-4 h-4" />
          Confirm Purchase
        </Button>
      </div>
    </Modal>
  );
}
