'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cast } from '@/lib/types/social';
import { formatDistanceToNow } from 'date-fns';

interface CastCardProps {
  cast: Cast;
  showThread?: boolean;
}

export function CastCard({ cast, showThread = false }: CastCardProps) {
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

  const timeAgo = formatDistanceToNow(new Date(cast.timestamp), { addSuffix: true });

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
              <span className="text-primary text-sm">✓</span>
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
                💬
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
                🔁
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
                {isLiked ? '❤️' : '🤍'}
              </span>
              <span className="text-sm">{likesCount}</span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <span className="group-hover:bg-primary/10 p-2 rounded-full transition-colors">
                📤
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
