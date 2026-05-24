import {
  Body,
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
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'channels', version: '1' })
export class ChannelsController {
  constructor(private readonly channels: ChannelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new channel' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateChannelDto) {
    return this.channels.create(user.sub, dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all channels (sorted by members)' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.channels.findAll(page, limit);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search channels' })
  search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.channels.search(query, limit);
  }

  @Get('me')
  @ApiOperation({ summary: "Get current user's joined channels" })
  getUserChannels(@CurrentUser() user: JwtPayload) {
    return this.channels.getUserChannels(user.sub);
  }

  @Get(':name')
  @Public()
  @ApiOperation({ summary: 'Get channel by name' })
  findOne(@Param('name') name: string) {
    return this.channels.findByName(name);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Join a channel' })
  join(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.channels.join(id, user.sub);
  }

  @Delete(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Leave a channel' })
  leave(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.channels.leave(id, user.sub);
  }

  @Get(':id/member-status')
  @ApiOperation({ summary: 'Check if user is a member of the channel' })
  memberStatus(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.channels.isMember(id, user.sub);
  }
}
