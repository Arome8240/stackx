import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log('[DEBUG] JwtAuthGuard.canActivate', req.method, req.url, 'auth header:', req.headers.authorization?.slice(0, 30));
    return super.canActivate(context);
  }

  handleRequest(err: unknown, user: unknown, info: unknown, context: ExecutionContext, status?: unknown) {
    console.log('[DEBUG] JwtAuthGuard.handleRequest', { err, user, info });
    return super.handleRequest(err, user, info, context, status);
  }
}
