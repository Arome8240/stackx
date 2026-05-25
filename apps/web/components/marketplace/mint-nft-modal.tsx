'use client';

import * as React from 'react';
import { Gem, AlertCircle, Info } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { callMintNFT } from '@/lib/stacks';
import type { Cast } from '@/lib/types/social';

interface MintNftModalProps {
  cast: Cast;
  open: boolean;
  onClose: () => void;
}

export function MintNftModal({ cast, open, onClose }: MintNftModalProps) {
  const [maxEditions, setMaxEditions] = React.useState(10);
  const [royaltyPct, setRoyaltyPct] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleMint() {
    setLoading(true);
    setError(null);
    try {
      await callMintNFT({ castId: cast._id, maxEditions, royaltyBps: royaltyPct * 100 });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Minting failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Mint Cast as NFT" size="sm">
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <p className="text-sm text-violet-300 font-medium line-clamp-2">{cast.content}</p>
          <p className="text-xs text-violet-400/60 mt-1">Cast #{cast._id.slice(-8)}</p>
        </div>

        <NumberInput
          label="Max editions"
          value={maxEditions}
          onChange={setMaxEditions}
          min={1}
          max={1000}
          step={1}
        />

        <NumberInput
          label="Creator royalty"
          value={royaltyPct}
          onChange={setRoyaltyPct}
          min={0}
          max={15}
          step={0.5}
          suffix="%"
        />

        <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-white/[0.02]">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-violet-400" />
          <span>Minting creates a SIP-009 NFT on the Stacks blockchain. You earn {royaltyPct}% royalty on each secondary sale. Platform takes 2.5% on sales.</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <Button variant="primary" onClick={handleMint} loading={loading} className="w-full">
          <Gem className="w-4 h-4" />
          Mint NFT ({maxEditions} edition{maxEditions !== 1 ? 's' : ''})
        </Button>
      </div>
    </Modal>
  );
}
