import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottleGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const forwarded = (req.headers as Record<string, string>)?.['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0].trim() : (req.ip as string) ?? 'unknown';
    return ip;
  }
}
