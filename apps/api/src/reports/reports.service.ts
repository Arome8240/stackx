import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument, ReportReason, ReportStatus, ReportTarget } from './schemas/report.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>) {}

  async create(data: {
    reporterId: string;
    targetType: ReportTarget;
    targetId: string;
    reason: ReportReason;
    details?: string;
  }): Promise<ReportDocument> {
    const existing = await this.reportModel.findOne({
      reporter: new Types.ObjectId(data.reporterId),
      targetId: new Types.ObjectId(data.targetId),
    });
    if (existing) throw new ConflictException('Already reported this content');

    return this.reportModel.create({
      reporter: new Types.ObjectId(data.reporterId),
      targetType: data.targetType,
      targetId: new Types.ObjectId(data.targetId),
      reason: data.reason,
      details: data.details ?? '',
    });
  }

  async getAll(status?: ReportStatus, page = 1, limit = 20): Promise<Paginated<ReportDocument>> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      this.reportModel
        .find(filter)
        .populate('reporter', 'username displayName avatarUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reportModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async resolve(reportId: string, adminId: string, note: string): Promise<void> {
    await this.reportModel.findByIdAndUpdate(reportId, {
      status: 'resolved',
      reviewedBy: new Types.ObjectId(adminId),
      adminNote: note,
    }).exec();
  }

  async dismiss(reportId: string, adminId: string): Promise<void> {
    await this.reportModel.findByIdAndUpdate(reportId, {
      status: 'dismissed',
      reviewedBy: new Types.ObjectId(adminId),
    }).exec();
  }

  async getPendingCount(): Promise<number> {
    return this.reportModel.countDocuments({ status: 'pending' });
  }
}
