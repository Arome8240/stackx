'use client';

import * as React from 'react';
import { BarChart2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePoll, useVotePoll, useMyVote } from '@/lib/hooks/use-polls';
import { Spinner } from '@/components/ui/spinner';

interface PollCardProps {
  castId: string;
}

export function PollCard({ castId }: PollCardProps) {
  const { data: poll, isLoading } = usePoll(castId);
  const { data: myVote } = useMyVote(castId);
  const voteMutation = useVotePoll();

  if (isLoading) return <div className="mt-3"><Spinner size="sm" /></div>;
  if (!poll) return null;

  const hasVoted = myVote != null;
  const totalVotes = poll.totalVotes ?? 0;
  const isExpired = poll.endsAt && new Date(poll.endsAt) < new Date();
  const showResults = hasVoted || isExpired || poll.closed;

  function getPercent(votes: number) {
    if (!totalVotes) return 0;
    return Math.round((votes / totalVotes) * 100);
  }

  const timeLeft = poll.endsAt ? getTimeLeft(poll.endsAt) : null;

  return (
    <div className="mt-3 p-3 rounded-xl border border-border/40 bg-white/[0.02] space-y-2">
      {poll.options.map((option, i) => {
        const pct = getPercent(option.votes ?? 0);
        const isWinner = showResults && (option.votes ?? 0) === Math.max(...poll.options.map((o) => o.votes ?? 0));
        const isMyVote = myVote === i;

        return (
          <div key={i}>
            {showResults ? (
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className={cn(
                    'absolute inset-0 rounded-lg transition-all duration-700',
                    isWinner ? 'bg-primary/15' : 'bg-white/[0.04]',
                  )}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between px-3 py-2 text-sm">
                  <span className={cn('font-medium', isMyVote && 'text-primary')}>
                    {option.label} {isMyVote && '✓'}
                  </span>
                  <span className="text-muted-foreground font-medium">{pct}%</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => voteMutation.mutate({ pollId: poll.id, optionIndex: i })}
                disabled={voteMutation.isPending}
                className="w-full text-left px-3 py-2 rounded-lg border border-border/40 hover:border-primary/50 hover:bg-primary/5 text-sm transition-colors"
              >
                {option.label}
              </button>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BarChart2 className="w-3 h-3" />
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </span>
        {timeLeft && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeLeft}
          </span>
        )}
        {(isExpired || poll.closed) && <span>Closed</span>}
      </div>
    </div>
  );
}

function getTimeLeft(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}
