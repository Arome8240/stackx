import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { Cast, CastSchema } from '../casts/schemas/cast.schema';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: Cast.name, schema: CastSchema },
    ]),
    UsersModule,
  ],
  providers: [FeedService],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
