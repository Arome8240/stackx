import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft, NftSchema } from './schemas/nft.schema';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { WalletModule } from '../wallet/wallet.module';
import { UsersModule } from '../users/users.module';
import { CastsModule } from '../casts/casts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }]),
    WalletModule,
    UsersModule,
    CastsModule,
  ],
  providers: [NftsService],
  controllers: [NftsController],
  exports: [NftsService],
})
export class NftsModule {}
