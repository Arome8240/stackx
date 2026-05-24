import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChannelMemberDocument = HydratedDocument<ChannelMember>;

@Schema({ timestamps: true, collection: 'channel_members' })
export class ChannelMember {
  @Prop({ type: Types.ObjectId, ref: 'Channel', required: true, index: true })
  channel: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ default: 'member', enum: ['member', 'moderator', 'admin'] })
  role: string;

  @Prop({ default: false })
  paidEntry: boolean;
}

export const ChannelMemberSchema = SchemaFactory.createForClass(ChannelMember);
ChannelMemberSchema.index({ channel: 1, user: 1 }, { unique: true });
