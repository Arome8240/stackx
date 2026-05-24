import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.users.findById(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.sub, dto);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search users by username or display name' })
  search(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.users.search(query ?? '', limit);
  }

  @Get('suggested')
  @ApiOperation({ summary: 'Get suggested users to follow' })
  getSuggested(@CurrentUser() user: JwtPayload) {
    return this.users.getSuggested(user.sub);
  }

  @Get(':username')
  @Public()
  @ApiOperation({ summary: 'Get user by username' })
  getByUsername(@Param('username') username: string) {
    return this.users.findByUsername(username);
  }
}
