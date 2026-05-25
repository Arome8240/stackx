import { Injectable, NestInterceptor, ExecutionContext, CallHandler, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const CACHE_TTL_KEY = 'cache_ttl';
export const CacheTtl = (ttlMs: number) => SetMetadata(CACHE_TTL_KEY, ttlMs);

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly store = new Map<string, { data: unknown; expiresAt: number }>();

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    if (req.method !== 'GET') return next.handle();

    const ttl = this.reflector.getAllAndOverride<number>(CACHE_TTL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!ttl) return next.handle();

    const key = `${req.url}_${req.user?._id ?? 'anon'}`;
    const cached = this.store.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        this.store.set(key, { data, expiresAt: Date.now() + ttl });
        this.cleanup();
      }),
    );
  }

  private cleanup() {
    if (this.store.size > 500) {
      const now = Date.now();
      for (const [key, val] of this.store) {
        if (val.expiresAt <= now) this.store.delete(key);
      }
    }
  }
}
