import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search users and casts' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'limit', required: false })
  searchAll(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.search.search(query, limit);
  }

  @Get('users')
  @Public()
  @ApiOperation({ summary: 'Search users only' })
  searchUsers(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.search.searchUsers(query, page, limit);
  }

  @Get('casts')
  @Public()
  @ApiOperation({ summary: 'Search casts by full-text' })
  searchCasts(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.search.searchCasts(query, page, limit);
  }

  @Get('trending')
  @Public()
  @ApiOperation({ summary: 'Get trending hashtags from last 24 hours' })
  trending(@Query('limit') limit?: number) {
    return this.search.getTrendingTopics(limit);
  }
}
