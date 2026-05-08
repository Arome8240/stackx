'use client';

import { use } from 'react';
import { CastCard } from '@/components/cast/cast-card';
import { mockUsers } from '@/lib/mock-data/users';
import { mockCasts } from '@/lib/mock-data/casts';
import { getCurrentUser } from '@/lib/mock-data/users';
import { useState } from 'react';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const user = mockUsers.find((u) => u.username === username);
  const currentUser = getCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'casts' | 'replies' | 'likes'>('casts');

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto border-x border-border min-h-screen p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p className="text-muted-foreground">@{username} doesn't exist</p>
      </div>
    );
  }

  const userCasts = mockCasts.filter((cast) => cast.author.id === user.id);
  const isOwnProfile = user.id === currentUser.id;

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold">{user.displayName}</h1>
        <p className="text-sm text-muted-foreground">{user.castsCount} casts</p>
      </div>

      {/* Banner */}
      {user.banner && (
        <div className="h-48 bg-gradient-to-r from-primary to-purple-500 overflow-hidden">
          <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />
        </div>
      )}
      {!user.banner && (
        <div className="h-48 bg-gradient-to-r from-primary to-purple-500" />
      )}

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-32 h-32 rounded-full border-4 border-background -mt-16"
          />
          {!isOwnProfile && (
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                isFollowing
                  ? 'bg-transparent border-2 border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
                  : 'bg-foreground text-background hover:opacity-90'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {isOwnProfile && (
            <button className="px-6 py-2 rounded-full font-semibold border-2 border-border hover:bg-accent transition-colors">
              Edit Profile
            </button>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
            {user.verified && <span className="text-primary text-xl">✓</span>}
          </div>
          <p className="text-muted-foreground mb-3">@{user.username}</p>
          <p className="mb-3">{user.bio}</p>
          <p className="text-muted-foreground text-sm">
            📅 Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-6 mb-4">
          <div>
            <span className="font-bold">{user.followingCount.toLocaleString()}</span>{' '}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div>
            <span className="font-bold">{user.followersCount.toLocaleString()}</span>{' '}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('casts')}
          className={`flex-1 py-4 font-semibold transition-colors ${
            activeTab === 'casts'
              ? 'border-b-2 border-primary'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Casts
        </button>
        <button
          onClick={() => setActiveTab('replies')}
          className={`flex-1 py-4 font-semibold transition-colors ${
            activeTab === 'replies'
              ? 'border-b-2 border-primary'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Replies
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 py-4 font-semibold transition-colors ${
            activeTab === 'likes'
              ? 'border-b-2 border-primary'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          Likes
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'casts' && (
          <>
            {userCasts.length > 0 ? (
              userCasts.map((cast) => <CastCard key={cast.id} cast={cast} />)
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No casts yet
              </div>
            )}
          </>
        )}
        {activeTab === 'replies' && (
          <div className="p-8 text-center text-muted-foreground">
            No replies yet
          </div>
        )}
        {activeTab === 'likes' && (
          <div className="p-8 text-center text-muted-foreground">
            No likes yet
          </div>
        )}
      </div>
    </div>
  );
}
