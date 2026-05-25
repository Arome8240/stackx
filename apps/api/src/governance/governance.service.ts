import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proposal, ProposalDocument } from './schemas/proposal.schema';
import { GovernanceVote, GovernanceVoteDocument } from './schemas/governance-vote.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class GovernanceService {
  constructor(
    @InjectModel(Proposal.name) private readonly proposalModel: Model<ProposalDocument>,
    @InjectModel(GovernanceVote.name) private readonly voteModel: Model<GovernanceVoteDocument>,
  ) {}

  async create(data: {
    proposerId: string;
    title: string;
    description: string;
    category?: string;
    durationDays?: number;
  }): Promise<ProposalDocument> {
    const durationMs = (data.durationDays ?? 7) * 24 * 3600_000;
    const endsAt = new Date(Date.now() + durationMs);

    return this.proposalModel.create({
      proposer: new Types.ObjectId(data.proposerId),
      title: data.title,
      description: data.description,
      category: data.category ?? 'general',
      endsAt,
      status: 'active',
    });
  }

  async getAll(status?: string, page = 1, limit = 20): Promise<Paginated<ProposalDocument>> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      this.proposalModel
        .find(filter)
        .populate('proposer', 'username displayName avatarUrl isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.proposalModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async getById(id: string): Promise<ProposalDocument> {
    const proposal = await this.proposalModel
      .findById(id)
      .populate('proposer', 'username displayName avatarUrl')
      .exec();
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async vote(proposalId: string, voterId: string, vote: 'yes' | 'no', votingPower = 1): Promise<void> {
    const proposal = await this.proposalModel.findById(proposalId);
    if (!proposal) throw new NotFoundException('Proposal not found');
    if (proposal.status !== 'active') throw new BadRequestException('Proposal is not active');
    if (new Date() > proposal.endsAt) throw new BadRequestException('Voting period ended');

    const existing = await this.voteModel.findOne({
      proposal: new Types.ObjectId(proposalId),
      voter: new Types.ObjectId(voterId),
    });
    if (existing) throw new ConflictException('Already voted on this proposal');

    await this.voteModel.create({
      proposal: new Types.ObjectId(proposalId),
      voter: new Types.ObjectId(voterId),
      vote,
      votingPower,
    });

    const field = vote === 'yes' ? 'yesVotes' : 'noVotes';
    const updated = await this.proposalModel
      .findByIdAndUpdate(proposalId, { $inc: { [field]: votingPower } }, { new: true })
      .exec();

    if (updated && (updated.yesVotes + updated.noVotes) >= updated.quorum) {
      const newStatus = updated.yesVotes > updated.noVotes ? 'passed' : 'rejected';
      await this.proposalModel.findByIdAndUpdate(proposalId, { status: newStatus }).exec();
    }
  }

  async getUserVote(proposalId: string, userId: string): Promise<'yes' | 'no' | null> {
    const vote = await this.voteModel.findOne({
      proposal: new Types.ObjectId(proposalId),
      voter: new Types.ObjectId(userId),
    }).exec();
    return vote ? vote.vote : null;
  }
}
