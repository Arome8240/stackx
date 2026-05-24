import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PollDocument = HydratedDocument<Poll>;

@Schema({ _id: false })
class PollOption {
  @Prop({ required: true })
  text: string;

  @Prop({ default: 0 })
  votes: number;
}

const PollOptionSchema = SchemaFactory.createForClass(PollOption);

@Schema({ timestamps: true, collection: 'polls' })
export class Poll {
  @Prop({ type: Types.ObjectId, ref: 'Cast', required: true, unique: true, index: true })
  cast: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop({ type: [PollOptionSchema], required: true })
  options: PollOption[];

  @Prop({ default: 0 })
  totalVotes: number;

  @Prop({ required: true })
  endsAt: Date;

  @Prop({ default: false })
  closed: boolean;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
PollSchema.index({ endsAt: 1 });
PollSchema.index({ creator: 1, createdAt: -1 });
