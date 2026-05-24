import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { Cast, CastDocument } from '../casts/schemas/cast.schema';
import { UsersService } from '../users/users.service';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<FollowDocument>,
    @InjectModel(Cast.name) private readonly castModel: Model<CastDocument>,
    private readonly users: UsersService,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    await this.followModel
      .findOneAndUpdate(
        { follower: new Types.ObjectId(followerId), following: new Types.ObjectId(followingId) },
        {},
        { upsert: true, setDefaultsOnInsert: true },
      )
      .exec();

    await Promise.all([
      this.users.incrementFollowing(followerId, 1),
      this.users.incrementFollowers(followingId, 1),
    ]);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const result = await this.followModel
      .findOneAndDelete({
        follower: new Types.ObjectId(followerId),
        following: new Types.ObjectId(followingId),
      })
      .exec();

    if (result) {
      await Promise.all([
        this.users.incrementFollowing(followerId, -1),
        this.users.incrementFollowers(followingId, -1),
      ]);
    }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const exists = await this.followModel.exists({
      follower: new Types.ObjectId(followerId),
      following: new Types.ObjectId(followingId),
    });
    return !!exists;
  }

  async getFollowingIds(userId: string): Promise<Types.ObjectId[]> {
    const follows = await this.followModel.find({ follower: new Types.ObjectId(userId) }).exec();
    return follows.map((f) => f.following);
  }

  async getHomeFeed(userId: string, page = 1, limit = 20): Promise<Paginated<CastDocument>> {
    const skip = (page - 1) * limit;
    const followingIds = await this.getFollowingIds(userId);

    const authorFilter = [...followingIds, new Types.ObjectId(userId)];
    const filter = { author: { $in: authorFilter }, deleted: false, replyTo: null };

    const [items, total] = await Promise.all([
      this.castModel
        .find(filter)
        .populate('author', 'username displayName avatarUrl isVerified tier')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.castModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async getDiscoverFeed(page = 1, limit = 20): Promise<Paginated<CastDocument>> {
    const skip = (page - 1) * limit;

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const filter = { deleted: false, replyTo: null, createdAt: { $gte: since } };

    const [items, total] = await Promise.all([
      this.castModel
        .find(filter)
        .populate('author', 'username displayName avatarUrl isVerified tier')
        .sort({ likesCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.castModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async getUserFeed(authorId: string, page = 1, limit = 20): Promise<Paginated<CastDocument>> {
    const skip = (page - 1) * limit;
    const filter = { author: new Types.ObjectId(authorId), deleted: false };

    const [items, total] = await Promise.all([
      this.castModel
        .find(filter)
        .populate('author', 'username displayName avatarUrl isVerified tier')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.castModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async getFollowers(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { following: new Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      this.followModel
        .find(filter)
        .populate('follower', 'username displayName avatarUrl isVerified followersCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.followModel.countDocuments(filter).exec(),
    ]);

    return paginate(items.map((f) => f.follower), total, page, limit);
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const filter = { follower: new Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      this.followModel
        .find(filter)
        .populate('following', 'username displayName avatarUrl isVerified followersCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.followModel.countDocuments(filter).exec(),
    ]);

    return paginate(items.map((f) => f.following), total, page, limit);
  }
}
