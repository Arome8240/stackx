import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

export interface CreateNotificationPayload {
  recipientId: string;
  actorId?: string;
  type: NotificationType;
  castId?: string;
  body?: string;
  amount?: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notifModel: Model<NotificationDocument>,
  ) {}

  async create(payload: CreateNotificationPayload): Promise<NotificationDocument> {
    return this.notifModel.create({
      recipient: new Types.ObjectId(payload.recipientId),
      actor: payload.actorId ? new Types.ObjectId(payload.actorId) : null,
      type: payload.type,
      cast: payload.castId ? new Types.ObjectId(payload.castId) : null,
      body: payload.body ?? '',
      amount: payload.amount ?? 0,
    });
  }

  async findForUser(
    userId: string,
    page = 1,
    limit = 20,
    unreadOnly = false,
  ): Promise<Paginated<NotificationDocument>> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { recipient: new Types.ObjectId(userId) };
    if (unreadOnly) filter.read = false;

    const [items, total] = await Promise.all([
      this.notifModel
        .find(filter)
        .populate('actor', 'username displayName avatarUrl isVerified')
        .populate('cast', 'content')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notifModel.countDocuments(filter).exec(),
    ]);

    return paginate(items, total, page, limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notifModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      read: false,
    });
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notifModel
      .updateMany({ recipient: new Types.ObjectId(userId), read: false }, { read: true })
      .exec();
  }

  async markRead(notifId: string): Promise<void> {
    await this.notifModel.findByIdAndUpdate(notifId, { read: true }).exec();
  }

  async deleteOld(daysOld = 30): Promise<number> {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    const result = await this.notifModel.deleteMany({ createdAt: { $lt: cutoff } }).exec();
    return result.deletedCount;
  }
}
