import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { FeedService } from './feed.service';

@ApiTags('feed')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'feed', version: '1' })
export class FeedController {
  constructor(private readonly feed: FeedService) {}

  @Get('home')
  @ApiOperation({ summary: 'Get personalized home feed (following + self)' })
  getHome(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.feed.getHomeFeed(user.sub, page, limit);
  }

  @Get('discover')
  @Public()
  @ApiOperation({ summary: 'Get discover feed (trending recent casts)' })
  getDiscover(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.feed.getDiscoverFeed(page, limit);
  }

  @Get('users/:userId')
  @Public()
  @ApiOperation({ summary: 'Get user-specific feed' })
  getUserFeed(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.feed.getUserFeed(userId, page, limit);
  }

  @Post('follow/:targetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Follow a user' })
  follow(@CurrentUser() user: JwtPayload, @Param('targetId') targetId: string) {
    return this.feed.follow(user.sub, targetId);
  }

  @Delete('follow/:targetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  unfollow(@CurrentUser() user: JwtPayload, @Param('targetId') targetId: string) {
    return this.feed.unfollow(user.sub, targetId);
  }

  @Get('following-status/:targetId')
  @ApiOperation({ summary: 'Check if current user follows target' })
  followingStatus(@CurrentUser() user: JwtPayload, @Param('targetId') targetId: string) {
    return this.feed.isFollowing(user.sub, targetId);
  }

  @Get('followers/:userId')
  @Public()
  @ApiOperation({ summary: 'Get followers list' })
  getFollowers(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.feed.getFollowers(userId, page, limit);
  }

  @Get('following/:userId')
  @Public()
  @ApiOperation({ summary: 'Get following list' })
  getFollowing(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.feed.getFollowing(userId, page, limit);
  }
}
