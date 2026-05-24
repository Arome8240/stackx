'use client';

import * as React from 'react';
import type { Poll } from '@/lib/types/social';
import { cn, formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface PollViewProps {
  poll: Poll;
  castId: string;
}

export function PollView({ poll }: PollViewProps) {
  const { toast } = useToast();
  const [voted, setVoted] = React.useState<number | undefined>(poll.userVote);
  const [votes, setVotes] = React.useState(poll.options.map(o => o.votes));
  const total = votes.reduce((a, b) => a + b, 0) || 1;

  const vote = (idx: number) => {
    if (voted !== undefined || poll.closed) return;
    setVoted(idx);
    setVotes(prev => prev.map((v, i) => (i === idx ? v + 1 : v)));
    toast({ type: 'success', title: 'Vote recorded on-chain!' });
  };

  const isExpired = new Date(poll.endsAt).getTime() < Date.now();
  const showResults = voted !== undefined || poll.closed || isExpired;

  return (
    <div className="mt-3 rounded-xl border border-border bg-muted/40 p-4 space-y-2">
      <p className="text-sm font-semibold">{poll.question}</p>
      <div className="space-y-2">
        {poll.options.map((opt, i) => {
          const pct = showResults ? Math.round((votes[i] / total) * 100) : 0;
          const isWinner = showResults && votes[i] === Math.max(...votes);
          return (
            <button
              key={i}
              onClick={() => vote(i)}
              disabled={showResults}
              className={cn(
                'w-full relative rounded-lg border text-left px-4 py-2.5 text-sm overflow-hidden transition-all',
                !showResults && 'hover:border-primary hover:bg-primary/5',
                voted === i ? 'border-primary' : 'border-border',
                showResults && isWinner && 'border-primary/50',
                showResults ? 'cursor-default' : 'cursor-pointer',
              )}
            >
              {/* Progress bar */}
              {showResults && (
                <div
                  className={cn('absolute inset-y-0 left-0 rounded-lg transition-all duration-700',
                    voted === i ? 'bg-primary/15' : 'bg-muted'
                  )}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className={cn('font-medium', voted === i && 'text-primary')}>
                  {opt.label}
                  {voted === i && ' ✓'}
                </span>
                {showResults && (
                  <span className={cn('text-xs font-semibold tabular-nums', isWinner && 'text-primary')}>
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {poll.totalVotes + (voted !== undefined && !poll.userVote ? 1 : 0)} votes ·{' '}
        {poll.closed || isExpired ? 'Poll ended' : `Ends ${formatTimeAgo(poll.endsAt)}`}
      </p>
    </div>
  );
}
