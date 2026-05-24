import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cast, CastDocument } from '../casts/schemas/cast.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Channel, ChannelDocument } from '../channels/schemas/channel.schema';

export interface PlatformStats {
  totalUsers: number;
  totalCasts: number;
  totalChannels: number;
  activeLast24h: number;
  castsLast24h: number;
}

export interface TrendingCast {
  cast: CastDocument;
  score: number;
}

export interface TopContributor {
  user: UserDocument;
  castsCount: number;
  tipsTotal: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Cast.name) private readonly castModel: Model<CastDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Channel.name) private readonly channelModel: Model<ChannelDocument>,
  ) {}

  async getPlatformStats(): Promise<PlatformStats> {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalUsers, totalCasts, totalChannels, castsLast24h] = await Promise.all([
      this.userModel.countDocuments({ isSuspended: false }),
      this.castModel.countDocuments({ deleted: false }),
      this.channelModel.countDocuments({ isSuspended: false }),
      this.castModel.countDocuments({ deleted: false, createdAt: { $gte: since24h } }),
    ]);

    return { totalUsers, totalCasts, totalChannels, activeLast24h: 0, castsLast24h };
  }

  async getTrendingCasts(limit = 10): Promise<TrendingCast[]> {
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const casts = await this.castModel
      .find({ deleted: false, replyTo: null, createdAt: { $gte: since } })
      .populate('author', 'username displayName avatarUrl isVerified tier')
      .sort({ likesCount: -1, recastsCount: -1, tipsTotal: -1 })
      .limit(limit)
      .exec();

    return casts.map((cast) => ({
      cast,
      score: cast.likesCount * 2 + cast.recastsCount * 3 + (cast.tipsTotal > 0 ? 5 : 0),
    }));
  }

  async getTopContributors(limit = 10): Promise<UserDocument[]> {
    return this.userModel
      .find({ isSuspended: false })
      .sort({ tipsReceived: -1, castsCount: -1 })
      .limit(limit)
      .select('username displayName avatarUrl isVerified castsCount tipsReceived followersCount')
      .exec();
  }

  async getTrendingChannels(limit = 10): Promise<ChannelDocument[]> {
    return this.channelModel
      .find({ isSuspended: false })
      .sort({ membersCount: -1, castsCount: -1 })
      .limit(limit)
      .populate('creator', 'username displayName avatarUrl')
      .exec();
  }

  async getUserStats(userId: string) {
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oid = new Types.ObjectId(userId);

    const [user, castsLast7d, totalLikes, totalTips] = await Promise.all([
      this.userModel.findById(oid),
      this.castModel.countDocuments({ author: oid, deleted: false, createdAt: { $gte: since7d } }),
      this.castModel
        .aggregate([
          { $match: { author: oid, deleted: false } },
          { $group: { _id: null, total: { $sum: '$likesCount' } } },
        ])
        .exec(),
      this.castModel
        .aggregate([
          { $match: { author: oid, deleted: false } },
          { $group: { _id: null, total: { $sum: '$tipsTotal' } } },
        ])
        .exec(),
    ]);

    return {
      user,
      castsLast7d,
      totalLikes: totalLikes[0]?.total ?? 0,
      totalTips: totalTips[0]?.total ?? 0,
    };
  }
}
