/**
 * StackX Social Platform V2 — Contract SDK
 * Full coverage of social-platform-v2.clar
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  PostConditions,
  Pc,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  principalCV,
  listCV,
  someCV,
  noneCV,
  boolCV,
  callReadOnlyFunction,
  cvToJSON,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

export interface ContractConfig {
  network: StacksNetwork;
  contractAddress: string;
  contractName: string;
}

export type TxCallback = { onFinish?: (data: unknown) => void; onCancel?: () => void };

// ── Helpers ──────────────────────────────────────────────────────────────────

function padList<T>(items: T[], max: number, empty: T): T[] {
  return [...items, ...Array(Math.max(0, max - items.length)).fill(empty)].slice(0, max);
}

// ── SDK Class ─────────────────────────────────────────────────────────────────

export class SocialPlatformV2 {
  private cfg: ContractConfig;

  constructor(cfg: ContractConfig) { this.cfg = cfg; }

  private call(fn: string, args: ReturnType<typeof uintCV>[], cb?: TxCallback) {
    return openContractCall({
      network: this.cfg.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.cfg.contractAddress,
      contractName: this.cfg.contractName,
      functionName: fn,
      functionArgs: args as never[],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      ...cb,
    });
  }

  private callSTX(fn: string, args: ReturnType<typeof uintCV>[], microStx: bigint, sender: string, cb?: TxCallback) {
    return openContractCall({
      network: this.cfg.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.cfg.contractAddress,
      contractName: this.cfg.contractName,
      functionName: fn,
      functionArgs: args as never[],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(sender, FungibleConditionCode.Equal, microStx),
      ],
      ...cb,
    });
  }

  private async readOnly(fn: string, args: ReturnType<typeof uintCV>[], sender: string) {
    const result = await callReadOnlyFunction({
      network: this.cfg.network,
      contractAddress: this.cfg.contractAddress,
      contractName: this.cfg.contractName,
      functionName: fn,
      functionArgs: args as never[],
      senderAddress: sender,
    });
    return cvToJSON(result);
  }

  // ── User ──

  registerUser(username: string, displayName: string, bio: string, avatarIpfs: string, cb?: TxCallback) {
    return this.call('register-user', [
      stringAsciiCV(username), stringUtf8CV(displayName),
      stringUtf8CV(bio), stringAsciiCV(avatarIpfs),
    ] as never[], cb);
  }

  updateProfile(displayName: string, bio: string, avatarIpfs: string, bannerIpfs?: string, website?: string, location?: string, cb?: TxCallback) {
    return this.call('update-profile', [
      stringUtf8CV(displayName), stringUtf8CV(bio), stringAsciiCV(avatarIpfs),
      bannerIpfs ? someCV(stringAsciiCV(bannerIpfs)) : noneCV(),
      website    ? someCV(stringAsciiCV(website))    : noneCV(),
      location   ? someCV(stringUtf8CV(location))    : noneCV(),
    ] as never[], cb);
  }

  getUser(address: string) { return this.readOnly('get-user', [principalCV(address)] as never[], address); }

  getUsernameOwner(username: string, sender: string) {
    return this.readOnly('get-username-owner', [stringAsciiCV(username)] as never[], sender);
  }

  // ── Casts ──

  createCast(
    content: string,
    imagesIpfs: string[],
    mentions: string[],
    parentCastId?: number,
    channelId?: number,
    cb?: TxCallback,
  ) {
    const paddedImages = padList(imagesIpfs, 4, '');
    return this.call('create-cast', [
      stringUtf8CV(content),
      listCV(paddedImages.map(img => stringAsciiCV(img))),
      listCV(mentions.slice(0, 10).map(m => principalCV(m))),
      parentCastId != null ? someCV(uintCV(parentCastId)) : noneCV(),
      channelId    != null ? someCV(uintCV(channelId))    : noneCV(),
    ] as never[], cb);
  }

  deleteCast(castId: number, cb?: TxCallback) {
    return this.call('delete-cast', [uintCV(castId)] as never[], cb);
  }

  pinCast(castId: number, cb?: TxCallback) {
    return this.call('pin-cast', [uintCV(castId)] as never[], cb);
  }

  getCast(castId: number, sender: string) {
    return this.readOnly('get-cast', [uintCV(castId)] as never[], sender);
  }

  // ── Social ──

  likeCast(castId: number, cb?: TxCallback)      { return this.call('like-cast',   [uintCV(castId)] as never[], cb); }
  unlikeCast(castId: number, cb?: TxCallback)    { return this.call('unlike-cast',  [uintCV(castId)] as never[], cb); }
  recast(castId: number, cb?: TxCallback)        { return this.call('recast',       [uintCV(castId)] as never[], cb); }
  unrecast(castId: number, cb?: TxCallback)      { return this.call('unrecast',     [uintCV(castId)] as never[], cb); }
  bookmarkCast(castId: number, cb?: TxCallback)  { return this.call('bookmark-cast',[uintCV(castId)] as never[], cb); }
  unbookmarkCast(castId: number, cb?: TxCallback){ return this.call('unbookmark-cast',[uintCV(castId)] as never[], cb); }

  followUser(address: string, cb?: TxCallback)   { return this.call('follow-user',  [principalCV(address)] as never[], cb); }
  unfollowUser(address: string, cb?: TxCallback) { return this.call('unfollow-user',[principalCV(address)] as never[], cb); }

  hasLikedCast(castId: number, user: string)     { return this.readOnly('has-liked-cast',  [uintCV(castId), principalCV(user)] as never[], user); }
  hasRecasted(castId: number, user: string)      { return this.readOnly('has-recasted',     [uintCV(castId), principalCV(user)] as never[], user); }
  hasBookmarked(castId: number, user: string)    { return this.readOnly('has-bookmarked',   [uintCV(castId), principalCV(user)] as never[], user); }
  isFollowing(follower: string, following: string) { return this.readOnly('is-following', [principalCV(follower), principalCV(following)] as never[], follower); }

  // ── STX Tipping ──

  tipCast(castId: number, microStx: number, sender: string, cb?: TxCallback) {
    return this.callSTX(
      'tip-cast',
      [uintCV(castId), uintCV(microStx)] as never[],
      BigInt(microStx),
      sender,
      cb,
    );
  }

  // ── Channels ──

  createChannel(name: string, description: string, imageIpfs: string, entryFee: number, isNsfw: boolean, isPrivate: boolean, cb?: TxCallback) {
    return this.call('create-channel', [
      stringAsciiCV(name), stringUtf8CV(description), stringAsciiCV(imageIpfs),
      uintCV(entryFee), boolCV(isNsfw), boolCV(isPrivate),
    ] as never[], cb);
  }

  joinChannel(channelId: number, entryFee: number, sender: string, cb?: TxCallback) {
    if (entryFee > 0) {
      return this.callSTX('join-channel', [uintCV(channelId)] as never[], BigInt(entryFee), sender, cb);
    }
    return this.call('join-channel', [uintCV(channelId)] as never[], cb);
  }

  leaveChannel(channelId: number, cb?: TxCallback) {
    return this.call('leave-channel', [uintCV(channelId)] as never[], cb);
  }

  getChannel(channelId: number, sender: string) {
    return this.readOnly('get-channel', [uintCV(channelId)] as never[], sender);
  }

  getChannelByName(name: string, sender: string) {
    return this.readOnly('get-channel-by-name', [stringAsciiCV(name)] as never[], sender);
  }

  isChannelMember(channelId: number, user: string) {
    return this.readOnly('is-channel-member', [uintCV(channelId), principalCV(user)] as never[], user);
  }

  // ── NFT ──

  mintCastNFT(castId: number, uri: string, maxEdition: number, cb?: TxCallback) {
    return this.call('mint-cast-nft', [uintCV(castId), stringAsciiCV(uri), uintCV(maxEdition)] as never[], cb);
  }

  transferNFT(nftId: number, sender: string, recipient: string, cb?: TxCallback) {
    return this.call('transfer', [uintCV(nftId), principalCV(sender), principalCV(recipient)] as never[], cb);
  }

  listNFT(nftId: number, priceStx: number, cb?: TxCallback) {
    return this.call('list-nft', [uintCV(nftId), uintCV(priceStx)] as never[], cb);
  }

  delistNFT(nftId: number, cb?: TxCallback) {
    return this.call('delist-nft', [uintCV(nftId)] as never[], cb);
  }

  buyNFT(nftId: number, priceStx: number, sender: string, cb?: TxCallback) {
    return this.callSTX('buy-nft', [uintCV(nftId)] as never[], BigInt(priceStx), sender, cb);
  }

  getNFTMetadata(nftId: number, sender: string) {
    return this.readOnly('get-nft-metadata', [uintCV(nftId)] as never[], sender);
  }

  getNFTListing(nftId: number, sender: string) {
    return this.readOnly('get-nft-listing', [uintCV(nftId)] as never[], sender);
  }

  getLastTokenId(sender: string) {
    return this.readOnly('get-last-token-id', [] as never[], sender);
  }

  getTokenURI(nftId: number, sender: string) {
    return this.readOnly('get-token-uri', [uintCV(nftId)] as never[], sender);
  }

  getNFTOwner(nftId: number, sender: string) {
    return this.readOnly('get-owner', [uintCV(nftId)] as never[], sender);
  }

  // ── Polls ──

  createPoll(
    castId: number,
    question: string,
    optionA: string,
    optionB: string,
    optionC: string | undefined,
    optionD: string | undefined,
    durationBlocks: number,
    cb?: TxCallback,
  ) {
    return this.call('create-poll', [
      uintCV(castId),
      stringUtf8CV(question),
      stringUtf8CV(optionA),
      stringUtf8CV(optionB),
      optionC ? someCV(stringUtf8CV(optionC)) : noneCV(),
      optionD ? someCV(stringUtf8CV(optionD)) : noneCV(),
      uintCV(durationBlocks),
    ] as never[], cb);
  }

  votePoll(pollId: number, option: 1 | 2 | 3 | 4, cb?: TxCallback) {
    return this.call('vote-poll', [uintCV(pollId), uintCV(option)] as never[], cb);
  }

  getPoll(pollId: number, sender: string) {
    return this.readOnly('get-poll', [uintCV(pollId)] as never[], sender);
  }

  getPollVote(pollId: number, user: string) {
    return this.readOnly('get-poll-vote', [uintCV(pollId), principalCV(user)] as never[], user);
  }

  // ── Governance ──

  createProposal(title: string, description: string, durationBlocks: number, cb?: TxCallback) {
    return this.call('create-proposal', [
      stringUtf8CV(title), stringUtf8CV(description), uintCV(durationBlocks),
    ] as never[], cb);
  }

  voteProposal(proposalId: number, vote: boolean, cb?: TxCallback) {
    return this.call('vote-proposal', [uintCV(proposalId), boolCV(vote)] as never[], cb);
  }

  // ── Reports ──

  reportCast(castId: number, reason: string, cb?: TxCallback) {
    return this.call('report-cast', [uintCV(castId), stringAsciiCV(reason)] as never[], cb);
  }

  // ── Platform Stats ──

  getPlatformStats(sender: string) {
    return this.readOnly('get-platform-stats', [] as never[], sender);
  }
}

export function createV2Contract(cfg: ContractConfig) {
  return new SocialPlatformV2(cfg);
}
