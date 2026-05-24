import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export type NotificationType = 'like' | 'recast' | 'reply' | 'follow' | 'tip' | 'mention' | 'system';

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  actor: Types.ObjectId | null;

  @Prop({ required: true, enum: ['like', 'recast', 'reply', 'follow', 'tip', 'mention', 'system'] })
  type: NotificationType;

  @Prop({ type: Types.ObjectId, ref: 'Cast', default: null })
  cast: Types.ObjectId | null;

  @Prop({ default: '' })
  body: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: 0 })
  amount: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });
