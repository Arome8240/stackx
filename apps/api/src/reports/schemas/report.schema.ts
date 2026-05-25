import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

export type ReportTarget = 'cast' | 'user' | 'channel';
export type ReportReason = 'spam' | 'harassment' | 'misinformation' | 'explicit' | 'scam' | 'other';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

@Schema({ timestamps: true, collection: 'reports' })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  reporter: Types.ObjectId;

  @Prop({ required: true, enum: ['cast', 'user', 'channel'] })
  targetType: ReportTarget;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  targetId: Types.ObjectId;

  @Prop({ required: true, enum: ['spam', 'harassment', 'misinformation', 'explicit', 'scam', 'other'] })
  reason: ReportReason;

  @Prop({ default: '' })
  details: string;

  @Prop({ default: 'pending', enum: ['pending', 'reviewing', 'resolved', 'dismissed'] })
  status: ReportStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy: Types.ObjectId | null;

  @Prop({ default: '' })
  adminNote: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.index({ reporter: 1, targetId: 1 }, { unique: true });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ targetType: 1, targetId: 1 });
