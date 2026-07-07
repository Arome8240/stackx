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
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

class SendMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  body: string;
}

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get conversation list with last message and unread count' })
  getConversations(@CurrentUser() user: JwtPayload) {
    return this.messages.getConversationList(user.sub);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get total unread DM count' })
  getUnreadCount(@CurrentUser() user: JwtPayload) {
    return this.messages.getUnreadCount(user.sub);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get conversation with a specific user' })
  getConversation(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.messages.getConversation(user.sub, userId, page, limit);
  }

  @Post(':recipientId')
  @ApiOperation({ summary: 'Send a DM to a user' })
  send(
    @CurrentUser() user: JwtPayload,
    @Param('recipientId') recipientId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.send(user.sub, recipientId, dto.body);
  }

  @Patch(':userId/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all messages from a user as read' })
  markRead(@CurrentUser() user: JwtPayload, @Param('userId') userId: string) {
    return this.messages.markRead(userId, user.sub);
  }
}
