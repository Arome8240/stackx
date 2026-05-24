import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NftDocument = HydratedDocument<Nft>;

@Schema({ timestamps: true, collection: 'nfts' })
export class Nft {
  @Prop({ required: true, unique: true })
  tokenId: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cast', required: true, index: true })
  cast: Types.ObjectId;

  @Prop({ required: true })
  tokenUri: string;

  @Prop({ default: 1 })
  edition: number;

  @Prop({ default: 1 })
  maxEdition: number;

  @Prop({ default: false })
  isListed: boolean;

  @Prop({ default: 0 })
  priceStx: number;

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: 0 })
  totalVolumeStx: number;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
NftSchema.index({ owner: 1 });
NftSchema.index({ creator: 1 });
NftSchema.index({ isListed: 1, priceStx: 1 });
NftSchema.index({ tokenId: 1 }, { unique: true });
