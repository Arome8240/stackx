'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Hash, Users, Lock, Settings, MessageSquare } from 'lucide-react';
import { useChannel, useJoinChannel, useIsChannelMember } from '@/lib/hooks/use-channels';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatNumber, formatSTX } from '@/lib/utils';

export default function ChannelPage() {
  const { name } = useParams<{ name: string }>();
  const { data: channel, isLoading } = useChannel(name);
  const { data: memberStatus } = useIsChannelMember(channel?._id ?? '');
  const joinMutation = useJoinChannel();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (!channel) {
    return (
      <EmptyState
        icon={Hash}
        title="Channel not found"
        description={`/${name} doesn't exist`}
        className="py-24"
      />
    );
  }

  const isMember = memberStatus?.isMember ?? false;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-lg">
            {channel.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-foreground flex items-center gap-2">
              /{channel.name}
              {channel.isPaid && <Lock className="w-4 h-4 text-amber-400" />}
            </h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatNumber(channel.membersCount ?? 0)} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {formatNumber(channel.castsCount ?? 0)} casts
              </span>
            </div>
          </div>
          {!isMember ? (
            <Button
              variant={channel.isPaid ? 'primary' : 'outline'}
              size="sm"
              onClick={() => joinMutation.mutate(channel._id)}
              loading={joinMutation.isPending}
            >
              {channel.isPaid ? `Join · ${formatSTX(channel.entryFeeStx ?? 0)} STX` : 'Join'}
            </Button>
          ) : (
            <Badge variant="primary">Member</Badge>
          )}
        </div>
      </div>

      {channel.description && (
        <div className="px-4 py-3 border-b border-border/40">
          <p className="text-sm text-muted-foreground">{channel.description}</p>
        </div>
      )}

      {channel.isPaid && !isMember ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="font-semibold text-foreground mb-2">Paid Channel</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Join for {formatSTX(channel.entryFeeStx ?? 0)} STX to access all casts in this channel.
          </p>
          <Button
            variant="primary"
            onClick={() => joinMutation.mutate(channel._id)}
            loading={joinMutation.isPending}
          >
            <Lock className="w-4 h-4" />
            Join for {formatSTX(channel.entryFeeStx ?? 0)} STX
          </Button>
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No casts yet"
          description="Be the first to cast in this channel"
          className="py-16"
        />
      )}
    </div>
  );
}
