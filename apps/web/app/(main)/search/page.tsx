'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data/users';
import { mockCasts } from '@/lib/mock-data/casts';
import { CastCard } from '@/components/cast/cast-card';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'casts'>('users');

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCasts = mockCasts.filter((cast) =>
    cast.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold mb-4">Search</h1>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users and casts..."
            className="w-full bg-input border border-border rounded-full px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
        </div>

        {/* Tabs */}
        {searchQuery && (
          <div className="flex border-b border-border -mb-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Users ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('casts')}
              className={`flex-1 py-2 font-semibold transition-colors ${
                activeTab === 'casts'
                  ? 'border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Casts ({filteredCasts.length})
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {!searchQuery && (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-4xl mb-4">🔍</p>
          <p>Search for users and casts</p>
        </div>
      )}

      {searchQuery && activeTab === 'users' && (
        <div>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 p-4 border-b border-border hover:bg-accent transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-semibold truncate">{user.displayName}</p>
                    {user.verified && <span className="text-primary">✓</span>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
                </div>
                <button className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90">
                  Follow
                </button>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {searchQuery && activeTab === 'casts' && (
        <div>
          {filteredCasts.length > 0 ? (
            filteredCasts.map((cast) => <CastCard key={cast.id} cast={cast} />)
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No casts found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
