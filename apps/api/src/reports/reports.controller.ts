import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ReportsService } from './reports.service';
import { ReportReason, ReportTarget, ReportStatus } from './schemas/report.schema';

class CreateReportDto {
  @ApiProperty({ enum: ['cast', 'user', 'channel'] })
  @IsEnum(['cast', 'user', 'channel'])
  targetType: ReportTarget;

  @ApiProperty()
  @IsMongoId()
  targetId: string;

  @ApiProperty({ enum: ['spam', 'harassment', 'misinformation', 'explicit', 'scam', 'other'] })
  @IsEnum(['spam', 'harassment', 'misinformation', 'explicit', 'scam', 'other'])
  reason: ReportReason;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string;
}

class ResolveReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a content report' })
  create(@Body() dto: CreateReportDto, @CurrentUser() user: JwtPayload) {
    return this.reports.create({
      reporterId: user.sub,
      targetType: dto.targetType,
      targetId: dto.targetId,
      reason: dto.reason,
      details: dto.details,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports (admin)' })
  getAll(
    @Query('status') status?: ReportStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reports.getAll(status, page, limit);
  }

  @Get('pending-count')
  @Public()
  @ApiOperation({ summary: 'Get count of pending reports' })
  pendingCount() {
    return this.reports.getPendingCount();
  }

  @Patch(':id/resolve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Resolve a report (admin)' })
  resolve(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reports.resolve(id, user.sub, dto.note ?? '');
  }

  @Patch(':id/dismiss')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Dismiss a report (admin)' })
  dismiss(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reports.dismiss(id, user.sub);
  }
}
