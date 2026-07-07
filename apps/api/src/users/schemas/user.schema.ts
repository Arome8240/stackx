import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ default: '' })
  displayName: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ default: '' })
  bannerUrl: string;

  @Prop({ default: '' })
  website: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  stxAddress: string;

  @Prop({ default: '', select: false })
  encryptedPrivateKey: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isSuspended: boolean;

  @Prop({ default: 0 })
  tier: number;

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ default: 0 })
  castsCount: number;

  @Prop({ default: 0 })
  tipsReceived: number;

  @Prop({ default: 0 })
  nftsMinted: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ stxAddress: 1 });
UserSchema.index({ createdAt: -1 });
