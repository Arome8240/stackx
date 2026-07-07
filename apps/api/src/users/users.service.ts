import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { WalletService } from '../wallet/wallet.service';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly wallet: WalletService,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  findByIdWithPassword(id: string) {
    return this.userModel.findById(id).select('+passwordHash').exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username: username.toLowerCase() }).exec();
    if (!user) throw new NotFoundException(`User @${username} not found`);
    return user;
  }

  async create(username: string, email: string, password: string): Promise<UserDocument> {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const { stxAddress, encryptedPrivateKey } = await this.wallet.generateWallet();
    return this.userModel.create({
      username,
      email,
      passwordHash,
      displayName: username,
      stxAddress,
      encryptedPrivateKey,
    });
  }

  /** Fetches a user with their encrypted wallet key included, for signing on-chain actions. */
  findByIdWithWalletKey(id: string) {
    return this.userModel.findById(id).select('+encryptedPrivateKey').exec();
  }

  findByResetTokenHash(tokenHash: string) {
    return this.userModel
      .findOne({ resetPasswordTokenHash: tokenHash, resetPasswordExpires: { $gt: new Date() } })
      .select('+resetPasswordTokenHash +resetPasswordExpires')
      .exec();
  }

  async setResetToken(id: string, tokenHash: string, expires: Date) {
    await this.userModel.findByIdAndUpdate(id, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: expires,
    }).exec();
  }

  async resetPassword(id: string, passwordHash: string) {
    await this.userModel.findByIdAndUpdate(id, {
      passwordHash,
      resetPasswordTokenHash: null,
      resetPasswordExpires: null,
    }).exec();
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async search(query: string, limit = 10): Promise<UserDocument[]> {
    return this.userModel
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } },
        ],
        isSuspended: false,
      })
      .limit(limit)
      .exec();
  }

  async getSuggested(excludeId: string, limit = 5): Promise<UserDocument[]> {
    return this.userModel
      .find({ _id: { $ne: excludeId }, isSuspended: false })
      .sort({ followersCount: -1 })
      .limit(limit)
      .exec();
  }

  async incrementFollowers(id: string, delta: 1 | -1) {
    return this.userModel.findByIdAndUpdate(id, { $inc: { followersCount: delta } }).exec();
  }

  async incrementFollowing(id: string, delta: 1 | -1) {
    return this.userModel.findByIdAndUpdate(id, { $inc: { followingCount: delta } }).exec();
  }

  async incrementCastsCount(id: string, delta: 1 | -1) {
    return this.userModel.findByIdAndUpdate(id, { $inc: { castsCount: delta } }).exec();
  }
}
