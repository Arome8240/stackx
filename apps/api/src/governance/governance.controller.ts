import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { GovernanceService } from './governance.service';

class CreateProposalDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({ enum: ['fees', 'tokenomics', 'nfts', 'product', 'general'] })
  @IsOptional()
  @IsEnum(['fees', 'tokenomics', 'nfts', 'product', 'general'])
  category?: string;

  @ApiPropertyOptional({ default: 7 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  durationDays?: number;
}

class VoteDto {
  @ApiProperty({ enum: ['yes', 'no'] })
  @IsEnum(['yes', 'no'])
  vote: 'yes' | 'no';
}

@ApiTags('governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'governance', version: '1' })
export class GovernanceController {
  constructor(private readonly governance: GovernanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a governance proposal' })
  create(@Body() dto: CreateProposalDto, @CurrentUser() user: JwtPayload) {
    return this.governance.create({ proposerId: user.sub, ...dto });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all proposals' })
  getAll(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.governance.getAll(status, page, limit);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get proposal by ID' })
  getOne(@Param('id') id: string) {
    return this.governance.getById(id);
  }

  @Post(':id/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vote on a proposal' })
  vote(
    @Param('id') id: string,
    @Body() dto: VoteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.governance.vote(id, user.sub, dto.vote);
  }

  @Get(':id/my-vote')
  @ApiOperation({ summary: 'Get current user vote on a proposal' })
  getMyVote(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.governance.getUserVote(id, user.sub);
  }
}
