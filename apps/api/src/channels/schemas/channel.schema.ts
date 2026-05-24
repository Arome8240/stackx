import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true, collection: 'channels' })
export class Channel {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  name: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  creator: Types.ObjectId;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: 0 })
  entryFeeStx: number;

  @Prop({ default: 0 })
  membersCount: number;

  @Prop({ default: 0 })
  castsCount: number;

  @Prop({ default: 0 })
  revenueTotal: number;

  @Prop({ default: false })
  isNsfw: boolean;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ default: false })
  isSuspended: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
ChannelSchema.index({ name: 1 });
ChannelSchema.index({ creator: 1 });
ChannelSchema.index({ membersCount: -1 });
ChannelSchema.index({ createdAt: -1 });
ChannelSchema.index({ name: 'text', description: 'text', displayName: 'text' });
