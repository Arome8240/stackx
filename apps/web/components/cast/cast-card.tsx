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
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  const [tokenSupply, setTokenSupply] = useState('');
  const [tokenPrice, setTokenPrice] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleRecast = () => {
    setIsRecasted(!isRecasted);
    setRecastsCount(isRecasted ? recastsCount - 1 : recastsCount + 1);
  };

  const handleTokenize = () => {
    if (tokenSupply && tokenPrice) {
      // TODO: Create NFT/token for this post
      console.log('Tokenizing post:', { supply: tokenSupply, price: tokenPrice });
      setShowTokenizeModal(false);
      setTokenSupply('');
      setTokenPrice('');
    }
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

            {/* Tokenize */}
            <button
              onClick={() => setShowTokenizeModal(true)}
              className="flex items-center gap-2 hover:text-yellow-500 transition-colors group ml-auto"
            >
              <span className="group-hover:bg-yellow-500/10 p-2 rounded-full transition-colors">
                💎
              </span>
              <span className="text-xs">Tokenize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tokenize Modal */}
      {showTokenizeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowTokenizeModal(false)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Tokenize Post</h2>
              <button
                onClick={() => setShowTokenizeModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Create collectible tokens for this post. Holders can trade and own a piece of this content.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Supply</label>
                  <input
                    type="number"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(e.target.value)}
                    placeholder="100"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price per Token (STX)</label>
                  <input
                    type="number"
                    value={tokenPrice}
                    onChange={(e) => setTokenPrice(e.target.value)}
                    placeholder="0.1"
                    step="0.01"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="bg-accent rounded-lg p-3">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Total Value:</span>{' '}
                    <span className="font-semibold">
                      {tokenSupply && tokenPrice ? (parseFloat(tokenSupply) * parseFloat(tokenPrice)).toFixed(2) : '0.00'} STX
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTokenizeModal(false)}
                className="flex-1 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTokenize}
                disabled={!tokenSupply || !tokenPrice || parseFloat(tokenSupply) <= 0 || parseFloat(tokenPrice) <= 0}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Create Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
