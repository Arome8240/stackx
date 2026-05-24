import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CastsModule } from './casts/casts.module';
import { FeedModule } from './feed/feed.module';
import { SearchModule } from './search/search.module';
import { ChannelsModule } from './channels/channels.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { NftsModule } from './nfts/nfts.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { PollsModule } from './polls/polls.module';
import { TipsModule } from './tips/tips.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/stackx'),
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('MongoDB connected'));
          connection.on('error', (err: Error) => console.error('MongoDB error:', err.message));
          return connection;
        },
      }),
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: 1000,
          limit: config.get<number>('THROTTLE_SHORT_LIMIT', 10),
        },
        {
          name: 'long',
          ttl: 60000,
          limit: config.get<number>('THROTTLE_LONG_LIMIT', 100),
        },
      ],
    }),

    AuthModule,
    UsersModule,
    CastsModule,
    FeedModule,
    SearchModule,
    ChannelsModule,
    NotificationsModule,
    AnalyticsModule,
    HealthModule,
    NftsModule,
    BookmarksModule,
    PollsModule,
    TipsModule,
  ],
})
export class AppModule {}
