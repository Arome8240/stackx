import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cast, CastDocument } from './schemas/cast.schema';
import { CreateCastDto } from './dto/create-cast.dto';
import { QueryCastsDto, CastSortBy } from './dto/query-casts.dto';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class CastsService {
  constructor(
    @InjectModel(Cast.name) private readonly castModel: Model<CastDocument>,
    private readonly users: UsersService,
  ) {}

  async create(authorId: string, dto: CreateCastDto): Promise<CastDocument> {
    let rootCast: Types.ObjectId | null = null;

    if (dto.replyTo) {
      const parent = await this.castModel.findById(dto.replyTo).exec();
      if (!parent) throw new NotFoundException('Parent cast not found');
      rootCast = parent.rootCast ?? parent._id as Types.ObjectId;
      await this.castModel.findByIdAndUpdate(dto.replyTo, { $inc: { repliesCount: 1 } }).exec();
    }

    const cast = await this.castModel.create({
      author: new Types.ObjectId(authorId),
      content: dto.content,
      images: dto.images ?? [],
      replyTo: dto.replyTo ? new Types.ObjectId(dto.replyTo) : null,
      rootCast,
      channel: dto.channel ?? '',
    });

    await this.users.incrementCastsCount(authorId, 1);
    return cast;
  }

  async findById(id: string): Promise<CastDocument> {
    const cast = await this.castModel
      .findOne({ _id: id, deleted: false })
      .populate('author', 'username displayName avatarUrl isVerified')
      .exec();
    if (!cast) throw new NotFoundException('Cast not found');
    return cast;
  }

  async query(dto: QueryCastsDto): Promise<Paginated<CastDocument>> {
    const { page = 1, limit = 20, sortBy, channel, authorId } = dto;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { deleted: false };
    if (channel) filter.channel = channel;
    if (authorId) filter.author = new Types.ObjectId(authorId);

    const sortMap: Record<CastSortBy, Record<string, 1 | -1>> = {
      [CastSortBy.RECENT]: { createdAt: -1 },
      [CastSortBy.POPULAR]: { likesCount: -1, createdAt: -1 },
      [CastSortBy.TIPS]: { tipsTotal: -1, createdAt: -1 },
    };

    const sort = sortMap[sortBy ?? CastSortBy.RECENT];

    const [items, total] = await Promise.all([
      this.castModel
        .find(filter)
        .populate('author', 'username displayName avatarUrl isVerified tier')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.castModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async getReplies(castId: string, page = 1, limit = 20): Promise<Paginated<CastDocument>> {
    const skip = (page - 1) * limit;
    const filter = { replyTo: new Types.ObjectId(castId), deleted: false };

    const [items, total] = await Promise.all([
      this.castModel
        .find(filter)
        .populate('author', 'username displayName avatarUrl isVerified')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.castModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async delete(id: string, userId: string): Promise<void> {
    const cast = await this.castModel.findById(id).exec();
    if (!cast) throw new NotFoundException('Cast not found');
    if (cast.author.toString() !== userId) throw new ForbiddenException('Not your cast');

    await this.castModel.findByIdAndUpdate(id, { deleted: true }).exec();
    await this.users.incrementCastsCount(userId, -1);

    if (cast.replyTo) {
      await this.castModel
        .findByIdAndUpdate(cast.replyTo, { $inc: { repliesCount: -1 } })
        .exec();
    }
  }

  async like(castId: string, _userId: string): Promise<void> {
    await this.castModel.findByIdAndUpdate(castId, { $inc: { likesCount: 1 } }).exec();
  }

  async unlike(castId: string, _userId: string): Promise<void> {
    await this.castModel
      .findByIdAndUpdate(castId, { $inc: { likesCount: -1 } })
      .exec();
  }

  async recast(castId: string, _userId: string): Promise<void> {
    await this.castModel.findByIdAndUpdate(castId, { $inc: { recastsCount: 1 } }).exec();
  }

  async recordTip(castId: string, amountMicro: number): Promise<void> {
    await this.castModel
      .findByIdAndUpdate(castId, { $inc: { tipsTotal: amountMicro } })
      .exec();
  }
}
