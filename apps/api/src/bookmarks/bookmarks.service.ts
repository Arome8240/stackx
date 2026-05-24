import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bookmark, BookmarkDocument } from './schemas/bookmark.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name) private readonly bookmarkModel: Model<BookmarkDocument>,
  ) {}

  async add(userId: string, castId: string): Promise<void> {
    try {
      await this.bookmarkModel.create({
        user: new Types.ObjectId(userId),
        cast: new Types.ObjectId(castId),
      });
    } catch {
      throw new ConflictException('Already bookmarked');
    }
  }

  async remove(userId: string, castId: string): Promise<void> {
    await this.bookmarkModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      cast: new Types.ObjectId(castId),
    }).exec();
  }

  async isBookmarked(userId: string, castId: string): Promise<boolean> {
    return !!(await this.bookmarkModel.exists({
      user: new Types.ObjectId(userId),
      cast: new Types.ObjectId(castId),
    }));
  }

  async getBookmarks(userId: string, page = 1, limit = 20): Promise<Paginated<BookmarkDocument>> {
    const skip = (page - 1) * limit;
    const filter = { user: new Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      this.bookmarkModel
        .find(filter)
        .populate({
          path: 'cast',
          populate: { path: 'author', select: 'username displayName avatarUrl isVerified' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookmarkModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async clearAll(userId: string): Promise<number> {
    const result = await this.bookmarkModel
      .deleteMany({ user: new Types.ObjectId(userId) })
      .exec();
    return result.deletedCount;
  }
}
