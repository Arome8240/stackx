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
import { CastsService } from './casts.service';
import { CreateCastDto } from './dto/create-cast.dto';
import { QueryCastsDto } from './dto/query-casts.dto';

@ApiTags('casts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'casts', version: '1' })
export class CastsController {
  constructor(private readonly casts: CastsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cast' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCastDto) {
    return this.casts.create(user.sub, dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Query casts with pagination' })
  query(@Query() dto: QueryCastsDto) {
    return this.casts.query(dto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get cast by ID' })
  findOne(@Param('id') id: string) {
    return this.casts.findById(id);
  }

  @Get(':id/replies')
  @Public()
  @ApiOperation({ summary: 'Get replies for a cast' })
  getReplies(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.casts.getReplies(id, page, limit);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cast' })
  delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casts.delete(id, user.sub);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a cast' })
  like(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casts.like(id, user.sub);
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlike a cast' })
  unlike(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casts.unlike(id, user.sub);
  }

  @Post(':id/recast')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Recast a cast' })
  recast(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casts.recast(id, user.sub);
  }
}
