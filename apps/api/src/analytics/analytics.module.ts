import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from '../casts/schemas/cast.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Channel, ChannelSchema } from '../channels/schemas/channel.schema';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cast.name, schema: CastSchema },
      { name: User.name, schema: UserSchema },
      { name: Channel.name, schema: ChannelSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
