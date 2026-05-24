import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(@InjectConnection() private readonly db: Connection) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'API liveness probe' })
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('readiness')
  @Public()
  @ApiOperation({ summary: 'API readiness probe — checks DB connection' })
  async readiness() {
    const dbState = this.db.readyState;
    const dbOk = dbState === 1;

    return {
      status: dbOk ? 'ok' : 'degraded',
      checks: {
        database: { status: dbOk ? 'ok' : 'error', state: dbState },
      },
    };
  }
}
