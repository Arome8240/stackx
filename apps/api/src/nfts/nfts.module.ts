import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft, NftSchema } from './schemas/nft.schema';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Nft.name, schema: NftSchema }])],
  providers: [NftsService],
  controllers: [NftsController],
  exports: [NftsService],
})
export class NftsModule {}
