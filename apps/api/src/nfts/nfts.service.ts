import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Nft, NftDocument } from './schemas/nft.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';

@Injectable()
export class NftsService {
  constructor(@InjectModel(Nft.name) private readonly nftModel: Model<NftDocument>) {}

  async getListings(page = 1, limit = 20): Promise<Paginated<NftDocument>> {
    const skip = (page - 1) * limit;
    const filter = { isListed: true };

    const [items, total] = await Promise.all([
      this.nftModel
        .find(filter)
        .populate('owner', 'username displayName avatarUrl isVerified')
        .populate('creator', 'username displayName avatarUrl')
        .populate('cast', 'content')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.nftModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async getByOwner(ownerId: string): Promise<NftDocument[]> {
    return this.nftModel
      .find({ owner: new Types.ObjectId(ownerId) })
      .populate('cast', 'content')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getByTokenId(tokenId: number): Promise<NftDocument> {
    const nft = await this.nftModel
      .findOne({ tokenId })
      .populate('owner', 'username displayName avatarUrl')
      .populate('creator', 'username displayName avatarUrl')
      .populate('cast', 'content')
      .exec();
    if (!nft) throw new NotFoundException(`NFT #${tokenId} not found`);
    return nft;
  }

  async syncFromChain(data: {
    tokenId: number;
    ownerId: string;
    creatorId: string;
    castId: string;
    tokenUri: string;
    edition: number;
    maxEdition: number;
  }): Promise<NftDocument> {
    return this.nftModel.findOneAndUpdate(
      { tokenId: data.tokenId },
      {
        tokenId: data.tokenId,
        owner: new Types.ObjectId(data.ownerId),
        creator: new Types.ObjectId(data.creatorId),
        cast: new Types.ObjectId(data.castId),
        tokenUri: data.tokenUri,
        edition: data.edition,
        maxEdition: data.maxEdition,
      },
      { upsert: true, new: true },
    ).exec();
  }

  async recordSale(tokenId: number, newOwnerId: string, priceStx: number): Promise<void> {
    await this.nftModel.findOneAndUpdate(
      { tokenId },
      {
        owner: new Types.ObjectId(newOwnerId),
        isListed: false,
        $inc: { salesCount: 1, totalVolumeStx: priceStx },
      },
    ).exec();
  }

  async getStats() {
    const [total, listed, topSales] = await Promise.all([
      this.nftModel.countDocuments(),
      this.nftModel.countDocuments({ isListed: true }),
      this.nftModel
        .aggregate([{ $group: { _id: null, volume: { $sum: '$totalVolumeStx' }, sales: { $sum: '$salesCount' } } }])
        .exec(),
    ]);

    return {
      totalNfts: total,
      listedNfts: listed,
      totalVolume: topSales[0]?.volume ?? 0,
      totalSales: topSales[0]?.sales ?? 0,
    };
  }
}
