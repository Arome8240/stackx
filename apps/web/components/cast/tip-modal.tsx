'use client';

import * as React from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { cn, formatSTX } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { callTipCast } from '@/lib/stacks';
import type { Cast } from '@/lib/types/social';

const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];

interface TipModalProps {
  cast: Cast;
  open: boolean;
  onClose: () => void;
}

export function TipModal({ cast, open, onClose }: TipModalProps) {
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const parsedAmount = parseFloat(amount);
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const platformFee = isValid ? parsedAmount * 0.025 : 0;
  const netAmount = isValid ? parsedAmount - platformFee : 0;

  async function handleTip() {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await callTipCast({ castId: cast._id, recipientAddress: cast.author.stxAddress ?? '', amountStx: parsedAmount });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Tip Creator" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-border/40">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{cast.author.displayName}</p>
            <p className="text-xs text-muted-foreground">@{cast.author.username}</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Quick amounts (STX)</label>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className={cn(
                  'py-2 rounded-lg text-sm font-medium border transition-colors',
                  amount === String(a)
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border/50 hover:border-primary/40 text-muted-foreground',
                )}
              >
                {a} STX
              </button>
            ))}
          </div>
        </div>

        <Input
          type="number"
          min="0.1"
          step="0.1"
          placeholder="Custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          suffix="STX"
        />

        {isValid && (
          <div className="rounded-lg bg-white/[0.02] p-3 space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Platform fee (2.5%)</span>
              <span>{formatSTX(platformFee)}</span>
            </div>
            <div className="flex justify-between font-medium text-foreground">
              <span>Creator receives</span>
              <span className="text-green-400">{formatSTX(netAmount)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <Button
          onClick={handleTip}
          disabled={!isValid || loading}
          loading={loading}
          variant="primary"
          className="w-full"
        >
          <Zap className="w-4 h-4" />
          Send {isValid ? `${amount} STX` : 'Tip'}
        </Button>
      </div>
    </Modal>
  );
}
