'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MessageCircle, Repeat2, Heart, Share2, Bookmark,
  MoreHorizontal, CheckCircle, Coins, Gem, BarChart3,
  Trash2, Pin, Flag,
} from 'lucide-react';
import type { Cast } from '@/lib/types/social';
import { cn, formatNumber, formatTimeAgo, formatSTX, copyToClipboard, parseContent, ipfsToHttp } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PollView } from './poll-view';

interface CastCardProps {
  cast: Cast;
  variant?: 'feed' | 'thread' | 'detail';
  showThread?: boolean;
  onReply?: (cast: Cast) => void;
}

export function CastCard({ cast, variant = 'feed', showThread, onReply }: CastCardProps) {
  const { toast } = useToast();
  const [liked, setLiked] = React.useState(cast.isLiked ?? false);
  const [recasted, setRecasted] = React.useState(cast.isRecasted ?? false);
  const [bookmarked, setBookmarked] = React.useState(cast.isBookmarked ?? false);
  const [likes, setLikes] = React.useState(cast.likesCount);
  const [recasts, setRecasts] = React.useState(cast.recastsCount);
  const [tipOpen, setTipOpen] = React.useState(false);
  const [nftOpen, setNftOpen] = React.useState(false);
  const [tipAmount, setTipAmount] = React.useState('');
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [likeAnim, setLikeAnim] = React.useState(false);

  if (cast.deleted) return null;

  const handleLike = () => {
    setLiked(v => !v);
    setLikes(n => liked ? n - 1 : n + 1);
    if (!liked) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 400);
    }
  };

  const handleRecast = () => {
    setRecasted(v => !v);
    setRecasts(n => recasted ? n - 1 : n + 1);
    if (!recasted) toast({ type: 'success', title: 'Recasted!' });
  };

  const handleBookmark = () => {
    setBookmarked(v => !v);
    toast({
      type: 'success',
      title: bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks',
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/cast/${cast.id}`;
    await copyToClipboard(url);
    toast({ type: 'success', title: 'Link copied!' });
  };

  const handleTip = () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) return;
    toast({ type: 'success', title: `Tipped ${tipAmount} STX!`, description: `To @${cast.author.username}` });
    setTipOpen(false);
    setTipAmount('');
  };

  const timeAgo = formatTimeAgo(cast.timestamp);
  const isThread = variant === 'thread';
  const isDetail = variant === 'detail';

  return (
    <>
      <article
        className={cn(
          'cast-card',
          isDetail ? 'p-5' : 'p-4',
          showThread && 'relative',
        )}
      >
        {/* Thread line */}
        {showThread && (
          <div className="absolute left-[31px] top-[68px] bottom-0 w-0.5 bg-border" />
        )}

        <div className="flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <Link href={`/profile/${cast.author.username}`}>
              <Avatar
                src={ipfsToHttp(cast.author.avatar)}
                alt={cast.author.displayName}
                size={isDetail ? 'lg' : 'md'}
                verified={cast.author.verified}
              />
            </Link>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 min-w-0">
                <Link href={`/profile/${cast.author.username}`} className="font-semibold hover:underline truncate text-sm">
                  {cast.author.displayName}
                </Link>
                {cast.author.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                )}
                {cast.author.tier >= 2 && (
                  <Badge variant="nft" className="text-[10px]">Creator</Badge>
                )}
                <span className="text-muted-foreground text-sm truncate">@{cast.author.username}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <Link href={`/cast/${cast.id}`} className="text-muted-foreground text-xs hover:underline whitespace-nowrap">
                  {timeAgo}
                </Link>
                {cast.channelId && (
                  <>
                    <span className="text-muted-foreground text-xs">in</span>
                    <Link href={`/channels/${cast.channelId}`} className="text-xs text-primary hover:underline">
                      /{cast.channelId}
                    </Link>
                  </>
                )}
              </div>

              {/* More button */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setMoreOpen(v => !v)}
                  className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {moreOpen && (
                  <div
                    className="absolute right-0 top-8 w-44 rounded-xl border border-border bg-popover shadow-modal z-50 overflow-hidden animate-scale-in"
                    onMouseLeave={() => setMoreOpen(false)}
                  >
                    {[
                      { icon: Share2, label: 'Copy link',   action: handleShare },
                      { icon: Pin,    label: 'Pin cast',    action: () => {} },
                      { icon: Flag,   label: 'Report',      action: () => {} },
                      { icon: Trash2, label: 'Delete',      action: () => {}, danger: true },
                    ].map(({ icon: Icon, label, action, danger }) => (
                      <button
                        key={label}
                        onClick={() => { action(); setMoreOpen(false); }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors',
                          danger && 'text-destructive hover:bg-destructive/10',
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className={cn('mb-3', isDetail && 'text-base leading-relaxed')}>
              <p className="whitespace-pre-wrap break-words">
                {parseContent(cast.content).map((part, i) => {
                  if (part.type === 'mention')
                    return <Link key={i} href={`/profile/${part.value.slice(1)}`} className="text-primary hover:underline">{part.value}</Link>;
                  if (part.type === 'hashtag')
                    return <Link key={i} href={`/search?q=${encodeURIComponent(part.value)}`} className="text-primary hover:underline">{part.value}</Link>;
                  if (part.type === 'link')
                    return <a key={i} href={part.value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{part.value}</a>;
                  return <React.Fragment key={i}>{part.value}</React.Fragment>;
                })}
              </p>

              {/* Images */}
              {cast.images && cast.images.length > 0 && (
                <div className={cn('mt-3 rounded-xl overflow-hidden', cast.images.length > 1 && 'grid grid-cols-2 gap-1')}>
                  {cast.images.map((img, i) => (
                    <img key={i} src={ipfsToHttp(img)} alt="" className="w-full object-cover max-h-96 rounded-lg" />
                  ))}
                </div>
              )}

              {/* Poll */}
              {cast.poll && <PollView poll={cast.poll} castId={cast.id} />}

              {/* NFT badge */}
              {cast.nftId && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="nft" className="gap-1">
                    <Gem className="w-3 h-3" /> NFT #{cast.nftId}
                  </Badge>
                </div>
              )}
            </div>

            {/* Engagement row */}
            <div className="flex items-center gap-1">
              {/* Reply */}
              <EngagementButton
                icon={<MessageCircle className="w-4 h-4" />}
                count={cast.repliesCount}
                label="Reply"
                onClick={() => onReply?.(cast)}
                hoverClass="hover:text-primary hover:bg-primary/10"
              />

              {/* Recast */}
              <EngagementButton
                icon={<Repeat2 className="w-4 h-4" />}
                count={recasts}
                label="Recast"
                active={recasted}
                onClick={handleRecast}
                activeClass="text-green-500"
                hoverClass="hover:text-green-500 hover:bg-green-500/10"
              />

              {/* Like */}
              <EngagementButton
                icon={<Heart className={cn('w-4 h-4', liked && 'fill-current', likeAnim && 'animate-heartbeat')} />}
                count={likes}
                label="Like"
                active={liked}
                onClick={handleLike}
                activeClass="text-red-500"
                hoverClass="hover:text-red-500 hover:bg-red-500/10"
              />

              {/* Tip */}
              <EngagementButton
                icon={<Coins className="w-4 h-4" />}
                count={cast.tipsCount}
                label="Tip STX"
                onClick={() => setTipOpen(true)}
                hoverClass="hover:text-yellow-500 hover:bg-yellow-500/10"
              />

              {/* Bookmark */}
              <EngagementButton
                icon={<Bookmark className={cn('w-4 h-4', bookmarked && 'fill-current')} />}
                label="Bookmark"
                active={bookmarked}
                onClick={handleBookmark}
                activeClass="text-primary"
                hoverClass="hover:text-primary hover:bg-primary/10"
              />

              {/* Mint NFT */}
              <EngagementButton
                icon={<Gem className="w-4 h-4" />}
                label="Mint NFT"
                onClick={() => setNftOpen(true)}
                hoverClass="hover:text-nft hover:bg-nft/10"
              />

              {/* Analytics (detail only) */}
              {isDetail && (
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{formatSTX(cast.tipsTotal)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Tip Modal */}
      <Modal open={tipOpen} onClose={() => setTipOpen(false)} size="sm">
        <ModalHeader title="Tip with STX" onClose={() => setTipOpen(false)} />
        <ModalBody className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Send STX directly to <span className="font-semibold text-foreground">@{cast.author.username}</span>. 2.5% platform fee applies.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['1', '5', '10'].map(v => (
              <button
                key={v}
                onClick={() => setTipAmount(v)}
                className={cn(
                  'py-2 rounded-xl text-sm font-semibold border transition-all',
                  tipAmount === v
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-accent'
                )}
              >
                {v} STX
              </button>
            ))}
          </div>
          <input
            type="number"
            value={tipAmount}
            onChange={e => setTipAmount(e.target.value)}
            placeholder="Custom amount (STX)"
            min="0.001"
            step="0.001"
            className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {tipAmount && parseFloat(tipAmount) > 0 && (
            <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>{tipAmount} STX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee (2.5%)</span>
                <span>{(parseFloat(tipAmount) * 0.025).toFixed(4)} STX</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1">
                <span>Author receives</span>
                <span className="text-green-500">{(parseFloat(tipAmount) * 0.975).toFixed(4)} STX</span>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setTipOpen(false)}>Cancel</Button>
          <Button
            onClick={handleTip}
            disabled={!tipAmount || parseFloat(tipAmount) <= 0}
            icon={<Coins className="w-4 h-4" />}
          >
            Send Tip
          </Button>
        </ModalFooter>
      </Modal>

      {/* Mint NFT Modal */}
      <Modal open={nftOpen} onClose={() => setNftOpen(false)} size="sm">
        <ModalHeader title="Mint Cast as NFT" onClose={() => setNftOpen(false)} />
        <ModalBody className="space-y-4">
          <div className="rounded-xl bg-nft/10 border border-nft/20 p-4">
            <p className="text-sm font-medium">"{cast.content.slice(0, 80)}{cast.content.length > 80 ? '…' : ''}"</p>
            <p className="text-xs text-muted-foreground mt-2">— @{cast.author.username}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Turn this cast into a collectible NFT (SIP-009). Collectors can buy and trade editions on the StackX marketplace.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Max editions</label>
              <input
                type="number"
                defaultValue="10"
                min="1"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Price per NFT (STX)</label>
              <input
                type="number"
                defaultValue="5"
                min="0.1"
                step="0.1"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setNftOpen(false)}>Cancel</Button>
          <Button
            className="bg-nft hover:bg-nft/90 border-0"
            icon={<Gem className="w-4 h-4" />}
            onClick={() => { toast({ type: 'success', title: 'NFT minted!', description: 'Your cast is now a collectible.' }); setNftOpen(false); }}
          >
            Mint NFT
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

/* ─── Engagement Button ─────────────────────────────────────────────── */

interface EngagementButtonProps {
  icon: React.ReactNode;
  count?: number;
  label: string;
  active?: boolean;
  activeClass?: string;
  hoverClass?: string;
  onClick?: () => void;
}

function EngagementButton({ icon, count, label, active, activeClass, hoverClass, onClick }: EngagementButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex items-center gap-1 group/btn transition-colors duration-150 text-muted-foreground rounded-full p-1',
        hoverClass,
        active && activeClass,
      )}
    >
      <span className="p-1.5 rounded-full transition-colors duration-150 group-hover/btn:bg-current/10">
        {icon}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-xs tabular-nums">{formatNumber(count)}</span>
      )}
    </button>
  );
}
