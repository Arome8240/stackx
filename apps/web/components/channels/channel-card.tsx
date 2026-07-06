'use client';

import * as React from 'react';
import Link from 'next/link';
import { Users, Lock, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber, formatSTX } from '@/lib/utils';
import type { Channel } from '@/lib/types/social';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
  channel: Channel;
  isMember?: boolean;
  onJoin?: () => void;
  joining?: boolean;
  className?: string;
}

export function ChannelCard({ channel, isMember, onJoin, joining, className }: ChannelCardProps) {
  return (
    <div className={cn('glass rounded-2xl p-4 space-y-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-lg">
            {channel.name[0].toUpperCase()}
          </div>
          <div>
            <Link href={`/channels/${channel.name}`} className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              /{channel.name}
              {channel.isPaid && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatNumber(channel.membersCount ?? 0)}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {formatNumber(channel.castsCount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {!isMember && (
          <Button
            size="sm"
            variant={channel.isPaid ? 'primary' : 'outline'}
            onClick={onJoin}
            loading={joining}
          >
            {channel.isPaid ? `Join · ${formatSTX(channel.entryFeeStx ?? 0)} STX` : 'Join'}
          </Button>
        )}
        {isMember && (
          <Badge variant="primary" className="shrink-0">Member</Badge>
        )}
      </div>

      {channel.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
      )}
    </div>
  );
}
