import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Channel, ChannelDocument } from './schemas/channel.schema';
import { ChannelMember, ChannelMemberDocument } from './schemas/channel-member.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private readonly channelModel: Model<ChannelDocument>,
    @InjectModel(ChannelMember.name) private readonly memberModel: Model<ChannelMemberDocument>,
  ) {}

  async create(creatorId: string, dto: CreateChannelDto): Promise<ChannelDocument> {
    const exists = await this.channelModel.findOne({ name: dto.name.toLowerCase() });
    if (exists) throw new ConflictException('Channel name already taken');

    const channel = await this.channelModel.create({
      ...dto,
      name: dto.name.toLowerCase(),
      creator: new Types.ObjectId(creatorId),
    });

    await this.memberModel.create({
      channel: channel._id,
      user: new Types.ObjectId(creatorId),
      role: 'admin',
    });

    await this.channelModel.findByIdAndUpdate(channel._id, { $inc: { membersCount: 1 } });
    return channel;
  }

  async findAll(page = 1, limit = 20): Promise<Paginated<ChannelDocument>> {
    const skip = (page - 1) * limit;
    const filter = { isSuspended: false };

    const [items, total] = await Promise.all([
      this.channelModel
        .find(filter)
        .populate('creator', 'username displayName avatarUrl')
        .sort({ membersCount: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.channelModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async findByName(name: string): Promise<ChannelDocument> {
    const channel = await this.channelModel
      .findOne({ name: name.toLowerCase(), isSuspended: false })
      .populate('creator', 'username displayName avatarUrl')
      .exec();
    if (!channel) throw new NotFoundException(`Channel /${name} not found`);
    return channel;
  }

  async search(query: string, limit = 10): Promise<ChannelDocument[]> {
    return this.channelModel
      .find({ $text: { $search: query }, isSuspended: false }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .exec();
  }

  async join(channelId: string, userId: string): Promise<void> {
    const channel = await this.channelModel.findById(channelId);
    if (!channel) throw new NotFoundException('Channel not found');

    // NOTE: `Channel` has no on-chain numeric ID today (channel creation is DB-only, never
    // published to the contract), so a paid channel's entry fee cannot be enforced/collected
    // on-chain yet even now that wallet custody moved server-side — that requires first deciding
    // how channels map to the contract's `join-channel(channel-id)` call. Out of scope for the
    // custodial-wallet migration; this remains a DB-only membership record as it was before.

    const isMember = await this.memberModel.exists({
      channel: new Types.ObjectId(channelId),
      user: new Types.ObjectId(userId),
    });
    if (isMember) throw new ConflictException('Already a member');

    await this.memberModel.create({
      channel: new Types.ObjectId(channelId),
      user: new Types.ObjectId(userId),
      role: 'member',
    });

    await this.channelModel.findByIdAndUpdate(channelId, { $inc: { membersCount: 1 } });
  }

  async leave(channelId: string, userId: string): Promise<void> {
    const channel = await this.channelModel.findById(channelId);
    if (!channel) throw new NotFoundException('Channel not found');
    if (channel.creator.toString() === userId) throw new ForbiddenException('Creator cannot leave their own channel');

    const result = await this.memberModel
      .findOneAndDelete({
        channel: new Types.ObjectId(channelId),
        user: new Types.ObjectId(userId),
      })
      .exec();

    if (result) {
      await this.channelModel.findByIdAndUpdate(channelId, { $inc: { membersCount: -1 } });
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    return !!(await this.memberModel.exists({
      channel: new Types.ObjectId(channelId),
      user: new Types.ObjectId(userId),
    }));
  }

  async getUserChannels(userId: string): Promise<ChannelDocument[]> {
    const memberships = await this.memberModel.find({ user: new Types.ObjectId(userId) }).exec();
    const channelIds = memberships.map((m) => m.channel);
    return this.channelModel.find({ _id: { $in: channelIds } }).exec();
  }
}
