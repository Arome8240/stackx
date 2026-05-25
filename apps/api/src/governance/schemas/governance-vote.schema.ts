import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GovernanceVoteDocument = HydratedDocument<GovernanceVote>;

@Schema({ timestamps: true, collection: 'governance_votes' })
export class GovernanceVote {
  @Prop({ type: Types.ObjectId, ref: 'Proposal', required: true, index: true })
  proposal: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  voter: Types.ObjectId;

  @Prop({ required: true, enum: ['yes', 'no'] })
  vote: 'yes' | 'no';

  @Prop({ default: 0 })
  votingPower: number;
}

export const GovernanceVoteSchema = SchemaFactory.createForClass(GovernanceVote);
GovernanceVoteSchema.index({ proposal: 1, voter: 1 }, { unique: true });
