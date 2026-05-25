'use client';

import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { useFollowers, useFollowing } from '@/lib/hooks/use-follow';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs } from '@/components/ui/tabs';
import { FollowButton } from '@/components/profile/follow-button';
import { formatNumber } from '@/lib/utils';

const TABS = [
  { id: 'followers', label: 'Followers' },
  { id: 'following', label: 'Following' },
];

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = React.useState('followers');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link href={`/profile/${username}`} className="p-1 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-foreground">@{username}</h1>
      </div>

      <div className="px-4 pt-3">
        <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} />
      </div>

      <div className="mt-2">
        {tab === 'followers' ? <UserList username={username} type="followers" /> : <UserList username={username} type="following" />}
      </div>
    </div>
  );
}

function UserList({ username, type }: { username: string; type: 'followers' | 'following' }) {
  const followersQuery = useFollowers(username);
  const followingQuery = useFollowing(username);
  const query = type === 'followers' ? followersQuery : followingQuery;
  const users: any[] = (query.data as any[]) ?? [];

  if (query.isLoading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <EmptyState
        icon={Users}
        title={type === 'followers' ? 'No followers yet' : 'Not following anyone'}
        description={type === 'followers' ? 'When people follow this account, they\'ll appear here' : 'Accounts this user follows will appear here'}
        className="py-16"
      />
    );
  }

  return (
    <div className="divide-y divide-border/20">
      {users.map((user: any) => (
        <div key={user._id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
          <Link href={`/profile/${user.username}`}>
            <Avatar size="md" src={user.avatarUrl} fallback={user.displayName ?? user.username} verified={user.tier === 2} />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${user.username}`} className="font-medium text-sm text-foreground hover:text-violet-400 transition-colors block truncate">
              {user.displayName ?? user.username}
            </Link>
            <p className="text-xs text-muted-foreground">@{user.username} · {formatNumber(user.followersCount ?? 0)} followers</p>
            {user.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{user.bio}</p>}
          </div>
          <FollowButton targetUserId={user._id} />
        </div>
      ))}
    </div>
  );
}
