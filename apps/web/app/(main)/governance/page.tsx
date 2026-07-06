'use client';

import * as React from 'react';
import {
  Vote,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart2,
  PlusCircle,
  TrendingUp,
  Zap,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';

type ProposalStatus = 'active' | 'passed' | 'rejected' | 'pending';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  totalVoters: number;
  quorum: number;
  status: ProposalStatus;
  endsAt: string;
  category: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: 'p1',
    title: 'Reduce platform fee from 2.5% to 2%',
    description: 'Proposal to lower the platform fee on STX tips to attract more creators and increase volume. This reduction would be partially offset by projected volume growth.',
    proposer: 'satoshi',
    yesVotes: 12_400,
    noVotes: 3_200,
    totalVoters: 15_600,
    quorum: 10_000,
    status: 'active',
    endsAt: new Date(Date.now() + 86400_000 * 3).toISOString(),
    category: 'Fees',
  },
  {
    id: 'p2',
    title: 'Add governance token distribution to top creators',
    description: 'Monthly distribution of governance tokens to the top 100 creators by tips received. Creates aligned incentives between platform success and creator behavior.',
    proposer: 'clarity_dev',
    yesVotes: 8_900,
    noVotes: 1_100,
    totalVoters: 10_000,
    quorum: 10_000,
    status: 'passed',
    endsAt: new Date(Date.now() - 86400_000 * 2).toISOString(),
    category: 'Tokenomics',
  },
  {
    id: 'p3',
    title: 'Increase NFT royalties to 7.5%',
    description: 'Raise secondary sale royalties for NFT creators from 5% to 7.5% to better compensate original creators and incentivize minting.',
    proposer: 'nft_artist',
    yesVotes: 4_200,
    noVotes: 7_800,
    totalVoters: 12_000,
    quorum: 10_000,
    status: 'rejected',
    endsAt: new Date(Date.now() - 86400_000 * 5).toISOString(),
    category: 'NFTs',
  },
  {
    id: 'p4',
    title: 'Launch StackX mobile app with native Stacks wallet',
    description: 'Allocate 500K STX from treasury to fund development of native iOS and Android apps with integrated Stacks wallet and biometric auth.',
    proposer: 'stacks_fan',
    yesVotes: 0,
    noVotes: 0,
    totalVoters: 0,
    quorum: 10_000,
    status: 'pending',
    endsAt: new Date(Date.now() + 86400_000 * 7).toISOString(),
    category: 'Product',
  },
];

const statusConfig: Record<ProposalStatus, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'text-primary bg-primary/10', icon: Clock },
  passed: { label: 'Passed', color: 'text-green-400 bg-green-500/10', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-500/10', icon: XCircle },
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-500/10', icon: Clock },
};

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [voted, setVoted] = React.useState<'yes' | 'no' | null>(null);
  const total = proposal.yesVotes + proposal.noVotes;
  const yesPercent = total > 0 ? Math.round((proposal.yesVotes / total) * 100) : 0;
  const noPercent = 100 - yesPercent;
  const quorumMet = total >= proposal.quorum;
  const { label, color, icon: StatusIcon } = statusConfig[proposal.status];
  const daysLeft = Math.max(0, Math.ceil((new Date(proposal.endsAt).getTime() - Date.now()) / 86400_000));

  return (
    <div className="glass rounded-2xl p-5 hover:bg-white/[0.03] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', color)}>
              <StatusIcon className="w-3 h-3" />
              {label}
            </span>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
              {proposal.category}
            </span>
          </div>
          <h3 className="font-semibold text-foreground leading-snug">{proposal.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{proposal.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {formatNumber(proposal.totalVoters)} voters
        </span>
        <span>by @{proposal.proposer}</span>
        {proposal.status === 'active' && (
          <span className="flex items-center gap-1 text-primary">
            <Clock className="w-3 h-3" />
            {daysLeft}d left
          </span>
        )}
        <span className={cn('flex items-center gap-1', quorumMet ? 'text-green-400' : 'text-yellow-400')}>
          <BarChart2 className="w-3 h-3" />
          Quorum {quorumMet ? 'met' : 'not met'}
        </span>
      </div>

      {/* Vote bars */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-400 font-medium">Yes</span>
            <span className="text-muted-foreground">{yesPercent}% · {formatNumber(proposal.yesVotes)} STX</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-700"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400 font-medium">No</span>
            <span className="text-muted-foreground">{noPercent}% · {formatNumber(proposal.noVotes)} STX</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-400 transition-all duration-700"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vote buttons */}
      {proposal.status === 'active' && (
        <div className="flex gap-2">
          <button
            onClick={() => setVoted('yes')}
            className={cn(
              'flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              voted === 'yes'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
            )}
          >
            {voted === 'yes' ? '✓ Voted Yes' : 'Vote Yes'}
          </button>
          <button
            onClick={() => setVoted('no')}
            className={cn(
              'flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              voted === 'no'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
            )}
          >
            {voted === 'no' ? '✓ Voted No' : 'Vote No'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function GovernancePage() {
  const [filter, setFilter] = React.useState<'all' | ProposalStatus>('all');

  const filtered = filter === 'all' ? PROPOSALS : PROPOSALS.filter((p) => p.status === filter);

  const stats = [
    { label: 'Active Proposals', value: PROPOSALS.filter((p) => p.status === 'active').length, icon: Vote },
    { label: 'Total Voters', value: '8,420', icon: Users },
    { label: 'Treasury', value: '184.5M STX', icon: Zap },
    { label: 'Proposals Passed', value: PROPOSALS.filter((p) => p.status === 'passed').length, icon: TrendingUp },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Vote className="w-6 h-6 text-primary" />
            Governance
          </h1>
          <button className="flex items-center gap-1.5 btn-primary px-4 py-2 text-sm rounded-xl">
            <PlusCircle className="w-4 h-4" />
            Propose
          </button>
        </div>
        <p className="text-muted-foreground text-sm">Vote on platform decisions using your STX balance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-3 text-center">
            <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 glass rounded-xl w-fit">
        {(['all', 'active', 'passed', 'rejected', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
              filter === f ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {filtered.map((p) => <ProposalCard key={p.id} proposal={p} />)}
      </div>
    </div>
  );
}
