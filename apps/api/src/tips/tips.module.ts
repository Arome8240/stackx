import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tip, TipSchema } from './schemas/tip.schema';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tip.name, schema: TipSchema }])],
  providers: [TipsService],
  controllers: [TipsController],
  exports: [TipsService],
})
export class TipsModule {}
