import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
  ) {}

  async send(senderId: string, recipientId: string, body: string): Promise<MessageDocument> {
    return this.messageModel.create({
      sender: new Types.ObjectId(senderId),
      recipient: new Types.ObjectId(recipientId),
      body,
    });
  }

  async getConversation(
    userAId: string,
    userBId: string,
    page = 1,
    limit = 50,
  ): Promise<Paginated<MessageDocument>> {
    const skip = (page - 1) * limit;
    const oidA = new Types.ObjectId(userAId);
    const oidB = new Types.ObjectId(userBId);

    const filter = {
      deleted: false,
      $or: [
        { sender: oidA, recipient: oidB },
        { sender: oidB, recipient: oidA },
      ],
    };

    const [items, total] = await Promise.all([
      this.messageModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.messageModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async getConversationList(userId: string): Promise<
    Array<{ partner: Types.ObjectId; lastMessage: MessageDocument; unread: number }>
  > {
    const oid = new Types.ObjectId(userId);

    const pipeline: PipelineStage[] = [
      { $match: { deleted: false, $or: [{ sender: oid }, { recipient: oid }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', oid] }, '$recipient', '$sender'],
          },
          lastMessage: { $first: '$$ROOT' },
          unread: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$recipient', oid] }, { $eq: ['$read', false] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
      { $limit: 50 },
    ];

    return this.messageModel.aggregate(pipeline).exec();
  }

  async markRead(senderId: string, recipientId: string): Promise<void> {
    await this.messageModel.updateMany(
      {
        sender: new Types.ObjectId(senderId),
        recipient: new Types.ObjectId(recipientId),
        read: false,
      },
      { read: true },
    ).exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      read: false,
      deleted: false,
    });
  }
}
