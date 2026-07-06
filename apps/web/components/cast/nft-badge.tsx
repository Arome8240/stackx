'use client';

import * as React from 'react';
import { Gem, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NftBadgeProps {
  tokenId?: number;
  className?: string;
  variant?: 'inline' | 'card';
}

export function NftBadge({ tokenId, className, variant = 'inline' }: NftBadgeProps) {
  if (variant === 'card') {
    return (
      <div className={cn('flex items-center gap-2 p-2.5 rounded-xl bg-nft/10 border border-nft/20', className)}>
        <Gem className="w-4 h-4 text-nft shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-nft">Cast NFT</p>
          {tokenId && <p className="text-xs text-muted-foreground">Token #{tokenId}</p>}
        </div>
        {tokenId && (
          <Link href={`/marketplace/${tokenId}`} className="text-muted-foreground hover:text-nft transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-nft/15 text-nft border border-nft/20', className)}>
      <Gem className="w-2.5 h-2.5" />
      NFT {tokenId ? `#${tokenId}` : ''}
    </span>
  );
}
