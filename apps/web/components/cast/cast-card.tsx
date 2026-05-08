'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cast } from '@/lib/types/social';
import { MessageCircle, Repeat2, Heart, Share2, CheckCircle } from 'lucide-react';

interface CastCardProps {
  cast: Cast;
  showThread?: boolean;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
}

export function CastCard({ cast }: CastCardProps) {
  const [isLiked, setIsLiked] = useState(cast.isLiked);
  const [isRecasted, setIsRecasted] = useState(cast.isRecasted);
  const [likesCount, setLikesCount] = useState(cast.likesCount);
  const [recastsCount, setRecastsCount] = useState(cast.recastsCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleRecast = () => {
    setIsRecasted(!isRecasted);
    setRecastsCount(isRecasted ? recastsCount - 1 : recastsCount + 1);
  };

  const timeAgo = formatTimeAgo(cast.timestamp);

  return (
    <article className="border-b border-border p-4 hover:bg-accent/50 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${cast.author.username}`}>
          <img
            src={cast.author.avatar}
            alt={cast.author.displayName}
            className="w-12 h-12 rounded-full hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${cast.author.username}`}
              className="font-semibold hover:underline"
            >
              {cast.author.displayName}
            </Link>
            {cast.author.verified && (
              <CheckCircle className="w-4 h-4 text-primary fill-primary" />
            )}
            <Link
              href={`/profile/${cast.author.username}`}
              className="text-muted-foreground text-sm hover:underline"
            >
              @{cast.author.username}
            </Link>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timeAgo}</span>
          </div>

          {/* Cast Content */}
          <div className="mb-3">
            <p className="whitespace-pre-wrap break-words">{cast.content}</p>
            
            {/* Images */}
            {cast.images && cast.images.length > 0 && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={cast.images[0]}
                  alt="Cast image"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 text-muted-foreground">
            {/* Reply */}
            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="group-hover:bg-primary/10 p-2 rounded-full transition-colors">
                <MessageCircle className="w-5 h-5" />
              </span>
              <span className="text-sm">{cast.repliesCount}</span>
            </button>

            {/* Recast */}
            <button
              onClick={handleRecast}
              className={`flex items-center gap-2 transition-colors group ${
                isRecasted ? 'text-green-500' : 'hover:text-green-500'
              }`}
            >
              <span className="group-hover:bg-green-500/10 p-2 rounded-full transition-colors">
                <Repeat2 className="w-5 h-5" />
              </span>
              <span className="text-sm">{recastsCount}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors group ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <span className="group-hover:bg-red-500/10 p-2 rounded-full transition-colors">
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </span>
              <span className="text-sm">{likesCount}</span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="group-hover:bg-primary/10 p-2 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
