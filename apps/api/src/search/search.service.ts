import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Cast, CastDocument } from '../casts/schemas/cast.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

export interface SearchResults {
  users: UserDocument[];
  casts: CastDocument[];
  total: number;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Cast.name) private readonly castModel: Model<CastDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async search(query: string, limit = 10): Promise<SearchResults> {
    if (!query.trim()) return { users: [], casts: [], total: 0 };

    const [users, casts] = await Promise.all([
      this.userModel
        .find({
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { displayName: { $regex: query, $options: 'i' } },
            { bio: { $regex: query, $options: 'i' } },
          ],
          isSuspended: false,
        })
        .select('username displayName avatarUrl isVerified followersCount bio')
        .sort({ followersCount: -1 })
        .limit(limit)
        .exec(),

      this.castModel
        .find(
          { $text: { $search: query }, deleted: false },
          { score: { $meta: 'textScore' } },
        )
        .populate('author', 'username displayName avatarUrl isVerified')
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .limit(limit)
        .exec(),
    ]);

    return { users, casts, total: users.length + casts.length };
  }

  async searchUsers(query: string, page = 1, limit = 20): Promise<UserDocument[]> {
    if (!query.trim()) return [];

    return this.userModel
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } },
        ],
        isSuspended: false,
      })
      .select('username displayName avatarUrl isVerified followersCount')
      .sort({ followersCount: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async searchCasts(query: string, page = 1, limit = 20): Promise<CastDocument[]> {
    if (!query.trim()) return [];

    return this.castModel
      .find(
        { $text: { $search: query }, deleted: false },
        { score: { $meta: 'textScore' } },
      )
      .populate('author', 'username displayName avatarUrl isVerified')
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async getTrendingTopics(limit = 10): Promise<Array<{ topic: string; count: number }>> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pipeline: PipelineStage[] = [
      { $match: { deleted: false, createdAt: { $gte: since } } },
      { $project: { words: { $split: ['$content', ' '] } } },
      { $unwind: '$words' },
      { $match: { words: { $regex: '^#[a-zA-Z0-9]+$' } } },
      { $group: { _id: '$words', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, topic: '$_id', count: 1 } },
    ];

    return this.castModel.aggregate(pipeline).exec();
  }
}
