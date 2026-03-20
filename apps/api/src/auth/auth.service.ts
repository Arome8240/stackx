import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.users.create(dto.username, dto.email, dto.password);
    return this.signToken(user._id.toString(), user.email, user.username);
  }

  async login(dto: LoginDto) {
    const user = (await this.users.findByEmail(dto.email)) as UserDocument | null;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user._id.toString(), user.email, user.username);
  }

  private signToken(sub: string, email: string, username: string) {
    const payload = { sub, email, username };
    return {
      access_token: this.jwt.sign(payload),
      user: { id: sub, email, username },
    };
  }
}
