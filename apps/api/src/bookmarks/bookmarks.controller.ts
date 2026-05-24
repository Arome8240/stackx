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
import { BookmarksService } from './bookmarks.service';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'bookmarks', version: '1' })
export class BookmarksController {
  constructor(private readonly bookmarks: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get bookmarks for current user' })
  getBookmarks(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookmarks.getBookmarks(user.sub, page, limit);
  }

  @Post(':castId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Bookmark a cast' })
  add(@Param('castId') castId: string, @CurrentUser() user: JwtPayload) {
    return this.bookmarks.add(user.sub, castId);
  }

  @Delete(':castId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove bookmark' })
  remove(@Param('castId') castId: string, @CurrentUser() user: JwtPayload) {
    return this.bookmarks.remove(user.sub, castId);
  }

  @Get(':castId/status')
  @ApiOperation({ summary: 'Check if cast is bookmarked' })
  status(@Param('castId') castId: string, @CurrentUser() user: JwtPayload) {
    return this.bookmarks.isBookmarked(user.sub, castId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all bookmarks' })
  clearAll(@CurrentUser() user: JwtPayload) {
    return this.bookmarks.clearAll(user.sub);
  }
}
