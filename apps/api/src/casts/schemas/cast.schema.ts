import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CastDocument = HydratedDocument<Cast>;

@Schema({ timestamps: true, collection: 'casts' })
export class Cast {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Cast', default: null, index: true })
  replyTo: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Cast', default: null, index: true })
  rootCast: Types.ObjectId | null;

  @Prop({ default: '' })
  channel: string;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  recastsCount: number;

  @Prop({ default: 0 })
  repliesCount: number;

  @Prop({ default: 0 })
  tipsTotal: number;

  @Prop({ default: false })
  hasNft: boolean;

  @Prop({ default: null })
  nftId: number | null;

  @Prop({ default: false })
  hasPoll: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: null })
  onChainId: number | null;

  @Prop({ default: 0 })
  blockHeight: number;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
CastSchema.index({ author: 1, createdAt: -1 });
CastSchema.index({ channel: 1, createdAt: -1 });
CastSchema.index({ replyTo: 1, createdAt: 1 });
CastSchema.index({ content: 'text' });
CastSchema.index({ createdAt: -1 });
