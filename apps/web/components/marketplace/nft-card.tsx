'use client';

import * as React from 'react';
import Link from 'next/link';
import { Gem, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface NFTCardProps {
  tokenId: number;
  title?: string;
  imageUrl?: string;
  priceStx?: number;
  isListed?: boolean;
  creator?: { username: string; displayName?: string; avatarUrl?: string };
  edition?: number;
  maxEdition?: number;
  onBuy?: () => void;
  buying?: boolean;
  className?: string;
}

export function NFTCard({
  tokenId,
  title,
  imageUrl,
  priceStx,
  isListed,
  creator,
  edition,
  maxEdition,
  onBuy,
  buying,
  className,
}: NFTCardProps) {
  return (
    <div className={cn('glass rounded-2xl overflow-hidden group', className)}>
      <div className="relative aspect-square bg-nft/10">
        {imageUrl ? (
          <img src={imageUrl} alt={title ?? `NFT #${tokenId}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gem className="w-12 h-12 text-nft/40" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="primary" className="text-xs">#{tokenId}</Badge>
        </div>
        {edition && maxEdition && (
          <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/60 text-white/80">
            {edition}/{maxEdition}
          </div>
        )}
      </div>

      <div className="p-3 space-y-2.5">
        <div>
          <h3 className="font-medium text-sm text-foreground truncate">{title ?? `Cast NFT #${tokenId}`}</h3>
          {creator && (
            <Link href={`/profile/${creator.username}`} className="flex items-center gap-1.5 mt-1 group/creator">
              <Avatar size="xs" src={creator.avatarUrl} fallback={creator.displayName ?? creator.username} />
              <span className="text-xs text-muted-foreground group-hover/creator:text-nft transition-colors">
                @{creator.username}
              </span>
            </Link>
          )}
        </div>

        {isListed && priceStx ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-bold text-sm text-nft">{formatNumber(priceStx)} STX</p>
            </div>
            <Button size="sm" variant="primary" onClick={onBuy} loading={buying}>
              Buy
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">Not listed</Badge>
            <Link href={`/marketplace/${tokenId}`} className="text-muted-foreground hover:text-nft transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
