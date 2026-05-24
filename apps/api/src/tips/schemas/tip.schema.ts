import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TipDocument = HydratedDocument<Tip>;

@Schema({ timestamps: true, collection: 'tips' })
export class Tip {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cast', required: true, index: true })
  cast: Types.ObjectId;

  @Prop({ required: true })
  amountMicroStx: number;

  @Prop({ required: true })
  platformFeeMicroStx: number;

  @Prop({ required: true })
  netAmountMicroStx: number;

  @Prop({ default: '' })
  txId: string;

  @Prop({ default: 0 })
  blockHeight: number;

  @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'failed'] })
  status: string;
}

export const TipSchema = SchemaFactory.createForClass(Tip);
TipSchema.index({ sender: 1, createdAt: -1 });
TipSchema.index({ recipient: 1, createdAt: -1 });
TipSchema.index({ cast: 1 });
TipSchema.index({ txId: 1 });
