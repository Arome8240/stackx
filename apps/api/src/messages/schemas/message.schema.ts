import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient: Types.ObjectId;

  @Prop({ required: true })
  body: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
MessageSchema.index({ recipient: 1, read: 1 });
