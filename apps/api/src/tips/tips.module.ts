import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tip, TipSchema } from './schemas/tip.schema';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { WalletModule } from '../wallet/wallet.module';
import { UsersModule } from '../users/users.module';
import { CastsModule } from '../casts/casts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tip.name, schema: TipSchema }]),
    WalletModule,
    UsersModule,
    CastsModule,
  ],
  providers: [TipsService],
  controllers: [TipsController],
  exports: [TipsService],
})
export class TipsModule {}
