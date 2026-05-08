'use client';

import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data/users';
import { mockChannels } from '@/lib/mock-data/channels';

export function RightSidebar() {
  const suggestedUsers = mockUsers.slice(0, 5);
  const trendingChannels = mockChannels.slice(0, 5);

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 p-4 hidden xl:block overflow-y-auto">
      <div className="space-y-6">
        {/* Suggested Users */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Suggested Users</h2>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold truncate">{user.displayName}</p>
                    {user.verified && <span className="text-primary">✓</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
                <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full hover:opacity-90">
                  Follow
                </button>
              </Link>
            ))}
          </div>
          <Link
            href="/search"
            className="block text-sm text-primary hover:underline mt-4"
          >
            Show more
          </Link>
        </div>

        {/* Trending Channels */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Trending Channels</h2>
          <div className="space-y-3">
            {trendingChannels.map((channel) => (
              <Link
                key={channel.id}
                href={`/channels/${channel.name}`}
                className="flex items-center gap-3 hover:bg-accent p-2 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-xl">
                  {channel.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">/{channel.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {channel.membersCount.toLocaleString()} members
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/channels"
            className="block text-sm text-primary hover:underline mt-4"
          >
            View all channels
          </Link>
        </div>
      </div>
    </aside>
  );
}
