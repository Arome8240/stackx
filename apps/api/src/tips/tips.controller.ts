import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { TipsService } from './tips.service';

@ApiTags('tips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tips', version: '1' })
export class TipsController {
  constructor(private readonly tips: TipsService) {}

  @Get('sent')
  @ApiOperation({ summary: 'Get tips sent by current user' })
  getSent(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.tips.getSentByUser(user.sub, page, limit);
  }

  @Get('received')
  @ApiOperation({ summary: 'Get tips received by current user' })
  getReceived(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.tips.getReceivedByUser(user.sub, page, limit);
  }

  @Get('stats/me')
  @ApiOperation({ summary: 'Get tip stats for current user' })
  getMyStats(@CurrentUser() user: JwtPayload) {
    return this.tips.getUserTipStats(user.sub);
  }

  @Get('stats/:userId')
  @Public()
  @ApiOperation({ summary: 'Get tip stats for any user' })
  getStats(@Param('userId') userId: string) {
    return this.tips.getUserTipStats(userId);
  }
}
