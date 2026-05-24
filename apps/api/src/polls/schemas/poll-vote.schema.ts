import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PollVoteDocument = HydratedDocument<PollVote>;

@Schema({ timestamps: true, collection: 'poll_votes' })
export class PollVote {
  @Prop({ type: Types.ObjectId, ref: 'Poll', required: true, index: true })
  poll: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  voter: Types.ObjectId;

  @Prop({ required: true })
  optionIndex: number;
}

export const PollVoteSchema = SchemaFactory.createForClass(PollVote);
PollVoteSchema.index({ poll: 1, voter: 1 }, { unique: true });
