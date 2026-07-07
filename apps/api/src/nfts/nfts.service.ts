import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pc, stringAsciiCV, uintCV } from '@stacks/transactions';
import { Nft, NftDocument } from './schemas/nft.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { CastsService } from '../casts/casts.service';

@Injectable()
export class NftsService {
  constructor(
    @InjectModel(Nft.name) private readonly nftModel: Model<NftDocument>,
    private readonly wallet: WalletService,
    private readonly users: UsersService,
    private readonly casts: CastsService,
  ) {}

  /**
   * Signs and broadcasts a mint transaction for the given cast. Note: the contract assigns the new
   * NFT's on-chain token ID only once the transaction confirms — this endpoint returns just the
   * pending txId; syncing the resulting NFT record into MongoDB requires a chain indexer/webhook
   * watching for the mint event, which doesn't exist yet (out of scope for this pass).
   */
  async mint(userId: string, castId: string, tokenUri: string, maxEdition: number): Promise<{ txId: string }> {
    const cast = await this.casts.findById(castId);
    if (!cast.onChainId) {
      throw new BadRequestException('This cast has not been published on-chain yet — it cannot be minted.');
    }

    const user = await this.users.findByIdWithWalletKey(userId);
    if (!user?.encryptedPrivateKey) {
      throw new BadRequestException('You do not have a wallet.');
    }

    return this.wallet.signAndBroadcastContractCall(user.encryptedPrivateKey, {
      functionName: 'mint-cast-nft',
      functionArgs: [uintCV(cast.onChainId), stringAsciiCV(tokenUri), uintCV(maxEdition)],
    });
  }

  /** Signs and broadcasts a buy transaction, then optimistically records the new ownership. */
  async buy(buyerId: string, tokenId: number): Promise<NftDocument> {
    const nft = await this.getByTokenId(tokenId);
    if (!nft.isListed) {
      throw new BadRequestException('This NFT is not listed for sale.');
    }

    const buyer = await this.users.findByIdWithWalletKey(buyerId);
    if (!buyer?.encryptedPrivateKey || !buyer.stxAddress) {
      throw new BadRequestException('You do not have a wallet.');
    }

    const priceMicroStx = Math.floor(nft.priceStx * 1_000_000);
    await this.wallet.signAndBroadcastContractCall(buyer.encryptedPrivateKey, {
      functionName: 'buy-nft',
      functionArgs: [uintCV(tokenId)],
      postConditions: [Pc.principal(buyer.stxAddress).willSendEq(priceMicroStx).ustx()],
    });

    await this.recordSale(tokenId, buyerId, nft.priceStx);
    return this.getByTokenId(tokenId);
  }

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
