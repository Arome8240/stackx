import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProposalDocument = HydratedDocument<Proposal>;

@Schema({ timestamps: true, collection: 'proposals' })
export class Proposal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  proposer: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'general', enum: ['fees', 'tokenomics', 'nfts', 'product', 'general'] })
  category: string;

  @Prop({ default: 0 })
  yesVotes: number;

  @Prop({ default: 0 })
  noVotes: number;

  @Prop({ default: 10_000 })
  quorum: number;

  @Prop({ required: true })
  endsAt: Date;

  @Prop({ default: 'pending', enum: ['pending', 'active', 'passed', 'rejected', 'cancelled'] })
  status: string;

  @Prop({ default: '' })
  onChainId: string;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);
ProposalSchema.index({ status: 1, createdAt: -1 });
ProposalSchema.index({ proposer: 1 });
ProposalSchema.index({ endsAt: 1 });
