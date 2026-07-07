import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pc, principalCV, uintCV } from '@stacks/transactions';
import { Tip, TipDocument } from './schemas/tip.schema';
import { paginate, Paginated } from '../common/interfaces/paginated.interface';
import { WalletService } from '../wallet/wallet.service';
import { UsersService } from '../users/users.service';
import { CastsService } from '../casts/casts.service';

const PLATFORM_FEE_BPS = 250;

@Injectable()
export class TipsService {
  constructor(
    @InjectModel(Tip.name) private readonly tipModel: Model<TipDocument>,
    private readonly wallet: WalletService,
    private readonly users: UsersService,
    private readonly casts: CastsService,
  ) {}

  /** Sends a tip on-chain (signed by the sender's custodial wallet) and records it. */
  async sendTip(senderId: string, castId: string, amountMicroStx: number): Promise<TipDocument> {
    const cast = await this.casts.findById(castId);
    if (!cast.onChainId) {
      throw new BadRequestException('This cast has not been published on-chain yet — it cannot be tipped.');
    }

    const recipientId = (cast.author as Types.ObjectId).toString();
    const [sender, recipient] = await Promise.all([
      this.users.findByIdWithWalletKey(senderId),
      this.users.findById(recipientId),
    ]);
    if (!sender?.encryptedPrivateKey || !sender.stxAddress) {
      throw new BadRequestException('Sender does not have a wallet.');
    }
    if (!recipient?.stxAddress) {
      throw new BadRequestException('Recipient does not have a wallet.');
    }

    const { txId } = await this.wallet.signAndBroadcastContractCall(sender.encryptedPrivateKey, {
      functionName: 'tip-cast',
      functionArgs: [uintCV(cast.onChainId), principalCV(recipient.stxAddress), uintCV(amountMicroStx)],
      postConditions: [Pc.principal(sender.stxAddress).willSendEq(amountMicroStx).ustx()],
    });

    return this.recordTip({ senderId, recipientId, castId, amountMicroStx, txId });
  }

  async recordTip(data: {
    senderId: string;
    recipientId: string;
    castId: string;
    amountMicroStx: number;
    txId?: string;
    blockHeight?: number;
  }): Promise<TipDocument> {
    const platformFeeMicroStx = Math.floor((data.amountMicroStx * PLATFORM_FEE_BPS) / 10_000);
    const netAmountMicroStx = data.amountMicroStx - platformFeeMicroStx;

    return this.tipModel.create({
      sender: new Types.ObjectId(data.senderId),
      recipient: new Types.ObjectId(data.recipientId),
      cast: new Types.ObjectId(data.castId),
      amountMicroStx: data.amountMicroStx,
      platformFeeMicroStx,
      netAmountMicroStx,
      txId: data.txId ?? '',
      blockHeight: data.blockHeight ?? 0,
      status: data.txId ? 'confirmed' : 'pending',
    });
  }

  async getSentByUser(userId: string, page = 1, limit = 20): Promise<Paginated<TipDocument>> {
    const skip = (page - 1) * limit;
    const filter = { sender: new Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      this.tipModel
        .find(filter)
        .populate('recipient', 'username displayName avatarUrl')
        .populate('cast', 'content')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.tipModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async getReceivedByUser(userId: string, page = 1, limit = 20): Promise<Paginated<TipDocument>> {
    const skip = (page - 1) * limit;
    const filter = { recipient: new Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      this.tipModel
        .find(filter)
        .populate('sender', 'username displayName avatarUrl')
        .populate('cast', 'content')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.tipModel.countDocuments(filter),
    ]);

    return paginate(items, total, page, limit);
  }

  async getUserTipStats(userId: string) {
    const oid = new Types.ObjectId(userId);

    const [sent, received] = await Promise.all([
      this.tipModel.aggregate([
        { $match: { sender: oid, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amountMicroStx' }, count: { $sum: 1 } } },
      ]).exec(),
      this.tipModel.aggregate([
        { $match: { recipient: oid, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$netAmountMicroStx' }, count: { $sum: 1 } } },
      ]).exec(),
    ]);

    return {
      sent: { total: sent[0]?.total ?? 0, count: sent[0]?.count ?? 0 },
      received: { total: received[0]?.total ?? 0, count: received[0]?.count ?? 0 },
    };
  }
}
