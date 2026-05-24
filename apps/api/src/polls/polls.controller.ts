import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PollsService } from './polls.service';
import { ApiProperty } from '@nestjs/swagger';

class VoteDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3)
  optionIndex: number;
}

class CreatePollDto {
  @ApiProperty()
  @IsString()
  castId: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  question: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ default: 24 })
  @IsNumber()
  @Min(1)
  @Max(168)
  durationHours: number;
}

@ApiTags('polls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'polls', version: '1' })
export class PollsController {
  constructor(private readonly polls: PollsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a poll for a cast' })
  create(@Body() dto: CreatePollDto, @CurrentUser() user: JwtPayload) {
    return this.polls.create({
      castId: dto.castId,
      creatorId: user.sub,
      question: dto.question,
      options: dto.options,
      durationHours: dto.durationHours,
    });
  }

  @Get('cast/:castId')
  @Public()
  @ApiOperation({ summary: 'Get poll for a cast' })
  getByCast(@Param('castId') castId: string) {
    return this.polls.findByCast(castId);
  }

  @Post(':pollId/vote')
  @ApiOperation({ summary: 'Vote on a poll option' })
  vote(
    @Param('pollId') pollId: string,
    @Body() dto: VoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.polls.vote(pollId, user.sub, dto.optionIndex);
  }

  @Get(':pollId/my-vote')
  @ApiOperation({ summary: "Get current user's vote on a poll" })
  getMyVote(@Param('pollId') pollId: string, @CurrentUser() user: JwtPayload) {
    return this.polls.getUserVote(pollId, user.sub);
  }
}
