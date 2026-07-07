import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { generateToken, hashPassword, hashToken } from '../common/utils/hash.util';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { UserDocument } from '../users/schemas/user.schema';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; username: string; stxAddress?: string };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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

  /** Always returns a generic success message, regardless of whether the email exists — avoids leaking which emails are registered. */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = (await this.users.findByEmail(email)) as UserDocument | null;

    if (user) {
      const rawToken = generateToken(48);
      const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await this.users.setResetToken((user._id as { toString(): string }).toString(), hashToken(rawToken), expires);

      const resetUrl = `${this.config.get<string>('app.frontendUrl')}/reset-password/${rawToken}`;
      // TODO: send this via a real email provider once one is configured — logged for now.
      console.log(`Password reset requested for ${user.email}: ${resetUrl}`);
    }

    return { message: 'If an account exists for that email, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.users.findByResetTokenHash(hashToken(token));
    if (!user) throw new BadRequestException('Invalid or expired reset token.');

    const passwordHash = await hashPassword(newPassword);
    await this.users.resetPassword((user._id as { toString(): string }).toString(), passwordHash);

    return { message: 'Password updated. You can now sign in.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.users.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect.');

    const passwordHash = await hashPassword(dto.newPassword);
    await this.users.resetPassword(userId, passwordHash);

    return { message: 'Password changed.' };
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
