import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { UserDocument } from '../users/schemas/user.schema';

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; username: string; stxAddress?: string };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const user = await this.users.create(dto.username, dto.email, dto.password);
    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = (await this.users.findByEmail(dto.email)) as UserDocument | null;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.isSuspended) throw new UnauthorizedException('Account suspended');

    return this.buildResponse(user);
  }

  private buildResponse(user: UserDocument): AuthResponse {
    const sub = (user._id as { toString(): string }).toString();
    const payload = { sub, email: user.email, username: user.username };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: sub, email: user.email, username: user.username, stxAddress: user.stxAddress || undefined },
    };
  }
}
