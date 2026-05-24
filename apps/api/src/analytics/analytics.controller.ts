import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('platform')
  @Public()
  @ApiOperation({ summary: 'Get platform-wide statistics' })
  getPlatformStats() {
    return this.analytics.getPlatformStats();
  }

  @Get('trending/casts')
  @Public()
  @ApiOperation({ summary: 'Get trending casts in last 48h' })
  getTrendingCasts(@Query('limit') limit?: number) {
    return this.analytics.getTrendingCasts(limit);
  }

  @Get('trending/channels')
  @Public()
  @ApiOperation({ summary: 'Get trending channels by membership' })
  getTrendingChannels(@Query('limit') limit?: number) {
    return this.analytics.getTrendingChannels(limit);
  }

  @Get('contributors/top')
  @Public()
  @ApiOperation({ summary: 'Get top contributors by tips received' })
  getTopContributors(@Query('limit') limit?: number) {
    return this.analytics.getTopContributors(limit);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get stats for a specific user' })
  getUserStats(@Param('userId') userId: string) {
    return this.analytics.getUserStats(userId);
  }
}
