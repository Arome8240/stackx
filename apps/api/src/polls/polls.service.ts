import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Poll, PollDocument } from './schemas/poll.schema';
import { PollVote, PollVoteDocument } from './schemas/poll-vote.schema';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll.name) private readonly pollModel: Model<PollDocument>,
    @InjectModel(PollVote.name) private readonly voteModel: Model<PollVoteDocument>,
  ) {}

  async create(data: {
    castId: string;
    creatorId: string;
    question: string;
    options: string[];
    durationHours: number;
  }): Promise<PollDocument> {
    if (data.options.length < 2 || data.options.length > 4) {
      throw new BadRequestException('Polls must have 2-4 options');
    }

    const endsAt = new Date(Date.now() + data.durationHours * 3600_000);

    return this.pollModel.create({
      cast: new Types.ObjectId(data.castId),
      creator: new Types.ObjectId(data.creatorId),
      question: data.question,
      options: data.options.map((text) => ({ text, votes: 0 })),
      endsAt,
    });
  }

  async findByCast(castId: string): Promise<PollDocument | null> {
    return this.pollModel.findOne({ cast: new Types.ObjectId(castId) }).exec();
  }

  async vote(pollId: string, userId: string, optionIndex: number): Promise<PollDocument> {
    const poll = await this.pollModel.findById(pollId).exec();
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.closed || new Date() > poll.endsAt) throw new BadRequestException('Poll has ended');
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new BadRequestException('Invalid option index');
    }

    const alreadyVoted = await this.voteModel.exists({
      poll: new Types.ObjectId(pollId),
      voter: new Types.ObjectId(userId),
    });
    if (alreadyVoted) throw new ConflictException('Already voted');

    await this.voteModel.create({
      poll: new Types.ObjectId(pollId),
      voter: new Types.ObjectId(userId),
      optionIndex,
    });

    const update: Record<string, unknown> = {
      $inc: { totalVotes: 1, [`options.${optionIndex}.votes`]: 1 },
    };

    const updated = await this.pollModel
      .findByIdAndUpdate(pollId, update, { new: true })
      .exec();

    return updated!;
  }

  async getUserVote(pollId: string, userId: string): Promise<number | null> {
    const vote = await this.voteModel.findOne({
      poll: new Types.ObjectId(pollId),
      voter: new Types.ObjectId(userId),
    }).exec();
    return vote ? vote.optionIndex : null;
  }
}
