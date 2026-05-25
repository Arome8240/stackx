'use client';

import * as React from 'react';
import { UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFollowStatus, useFollow } from '@/lib/hooks/use-follow';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const [hovering, setHovering] = React.useState(false);
  const { data: status, isLoading } = useFollowStatus(targetUserId);
  const { follow, unfollow } = useFollow(targetUserId);
  const isFollowing = status?.isFollowing ?? false;

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        <UserPlus className="w-4 h-4" />
        Follow
      </Button>
    );
  }

  if (isFollowing) {
    return (
      <Button
        variant={hovering ? 'danger' : 'outline'}
        size="sm"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => unfollow.mutate()}
        loading={unfollow.isPending}
        className={className}
      >
        {hovering ? (
          <>
            <UserMinus className="w-4 h-4" />
            Unfollow
          </>
        ) : (
          <>
            <UserCheck className="w-4 h-4" />
            Following
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={() => follow.mutate()}
      loading={follow.isPending}
      className={className}
    >
      <UserPlus className="w-4 h-4" />
      Follow
    </Button>
  );
}
