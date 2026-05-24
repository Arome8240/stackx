import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from './schemas/cast.schema';
import { CastsService } from './casts.service';
import { CastsController } from './casts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cast.name, schema: CastSchema }]),
    UsersModule,
  ],
  providers: [CastsService],
  controllers: [CastsController],
  exports: [CastsService],
})
export class CastsModule {}
