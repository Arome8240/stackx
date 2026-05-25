'use client';

import * as React from 'react';
import Link from 'next/link';
import { Vote, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

type ProposalStatus = 'draft' | 'active' | 'passed' | 'rejected' | 'executed';

interface Proposal {
  _id: string;
  title: string;
  description: string;
  category: string;
  yesVotes: number;
  noVotes: number;
  quorum: number;
  endsAt: string;
  status: ProposalStatus;
}

interface ProposalCardProps {
  proposal: Proposal;
  myVote?: 'yes' | 'no' | null;
  onVote?: (proposalId: string, vote: 'yes' | 'no') => void;
  voting?: boolean;
}

const STATUS_CONFIG: Record<ProposalStatus, { label: string; icon: React.ElementType; color: string }> = {
  draft: { label: 'Draft', icon: AlertCircle, color: 'text-muted-foreground' },
  active: { label: 'Active', icon: Vote, color: 'text-green-400' },
  passed: { label: 'Passed', icon: CheckCircle, color: 'text-green-400' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400' },
  executed: { label: 'Executed', icon: CheckCircle, color: 'text-violet-400' },
};

export function ProposalCard({ proposal, myVote, onVote, voting }: ProposalCardProps) {
  const total = proposal.yesVotes + proposal.noVotes;
  const yesPct = total > 0 ? (proposal.yesVotes / total) * 100 : 0;
  const quorumPct = Math.min((total / (proposal.quorum || 1)) * 100, 100);
  const statusCfg = STATUS_CONFIG[proposal.status];
  const StatusIcon = statusCfg.icon;
  const isActive = proposal.status === 'active';
  const timeLeft = getTimeLeft(proposal.endsAt);

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs capitalize">{proposal.category}</Badge>
            <span className={cn('flex items-center gap-1 text-xs font-medium', statusCfg.color)}>
              <StatusIcon className="w-3 h-3" />
              {statusCfg.label}
            </span>
          </div>
          <Link href={`/governance/${proposal._id}`} className="font-semibold text-foreground hover:text-violet-400 transition-colors">
            {proposal.title}
          </Link>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{proposal.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>For: {formatNumber(proposal.yesVotes)} ({yesPct.toFixed(0)}%)</span>
          <span>Against: {formatNumber(proposal.noVotes)}</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
            style={{ width: `${yesPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Quorum: {quorumPct.toFixed(0)}% of {formatNumber(proposal.quorum)}</span>
          {isActive && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
          )}
        </div>
      </div>

      {isActive && !myVote && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
            onClick={() => onVote?.(proposal._id, 'yes')}
            loading={voting}
          >
            Vote For
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            onClick={() => onVote?.(proposal._id, 'no')}
            loading={voting}
          >
            Vote Against
          </Button>
        </div>
      )}
      {myVote && (
        <p className="text-xs text-muted-foreground text-center">
          You voted <span className={myVote === 'yes' ? 'text-green-400' : 'text-red-400'}>{myVote === 'yes' ? 'for' : 'against'}</span> this proposal
        </p>
      )}
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
