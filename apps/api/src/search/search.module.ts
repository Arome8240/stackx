import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from '../casts/schemas/cast.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cast.name, schema: CastSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}
