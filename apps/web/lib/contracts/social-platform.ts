/**
 * StackX Social Platform Contract SDK
 * Interact with the Clarity smart contract
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  principalCV,
  listCV,
  someCV,
  noneCV,
  trueCV,
  falseCV,
  callReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

export interface ContractConfig {
  network: StacksNetwork;
  contractAddress: string;
  contractName: string;
}

export class SocialPlatformContract {
  private config: ContractConfig;

  constructor(config: ContractConfig) {
    this.config = config;
  }

  /**
   * Register a new user
   */
  async registerUser(
    username: string,
    displayName: string,
    bio: string,
    avatarIpfs: string,
    senderAddress: string
  ) {
    const functionArgs = [
      stringAsciiCV(username),
      stringUtf8CV(displayName),
      stringUtf8CV(bio),
      stringAsciiCV(avatarIpfs),
    ];

    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'register-user',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('User registered:', data);
      },
      onCancel: () => {
        console.log('User registration cancelled');
      },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    displayName: string,
    bio: string,
    avatarIpfs: string,
    bannerIpfs?: string
  ) {
    const functionArgs = [
      stringUtf8CV(displayName),
      stringUtf8CV(bio),
      stringAsciiCV(avatarIpfs),
      bannerIpfs ? someCV(stringAsciiCV(bannerIpfs)) : noneCV(),
    ];

    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'update-profile',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Create a cast (post)
   */
  async createCast(
    content: string,
    imagesIpfs: string[],
    mentions: string[],
    parentCastId?: number,
    channelId?: number
  ) {
    const functionArgs = [
      stringUtf8CV(content),
      listCV(imagesIpfs.map((img) => stringAsciiCV(img))),
      listCV(mentions.map((addr) => principalCV(addr))),
      parentCastId ? someCV(uintCV(parentCastId)) : noneCV(),
      channelId ? someCV(uintCV(channelId)) : noneCV(),
    ];

    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'create-cast',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Like a cast
   */
  async likeCast(castId: number) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'like-cast',
      functionArgs: [uintCV(castId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Unlike a cast
   */
  async unlikeCast(castId: number) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'unlike-cast',
      functionArgs: [uintCV(castId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Recast a post
   */
  async recast(castId: number) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'recast',
      functionArgs: [uintCV(castId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Unrecast a post
   */
  async unrecast(castId: number) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'unrecast',
      functionArgs: [uintCV(castId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Follow a user
   */
  async followUser(userAddress: string) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'follow-user',
      functionArgs: [principalCV(userAddress)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(userAddress: string) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'unfollow-user',
      functionArgs: [principalCV(userAddress)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Create a channel
   */
  async createChannel(name: string, description: string, imageIpfs: string) {
    const functionArgs = [
      stringAsciiCV(name),
      stringUtf8CV(description),
      stringAsciiCV(imageIpfs),
    ];

    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'create-channel',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Join a channel
   */
  async joinChannel(channelId: number) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'join-channel',
      functionArgs: [uintCV(channelId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Leave a channel
   */
  async leaveChannel(channelId: number) {
    return openContractCall({
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'leave-channel',
      functionArgs: [uintCV(channelId)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
    });
  }

  /**
   * Read-only: Get user profile
   */
  async getUser(userAddress: string) {
    const result = await callReadOnlyFunction({
      network: this.config.network,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'get-user',
      functionArgs: [principalCV(userAddress)],
      senderAddress: userAddress,
    });

    return cvToJSON(result);
  }

  /**
   * Read-only: Get cast
   */
  async getCast(castId: number, senderAddress: string) {
    const result = await callReadOnlyFunction({
      network: this.config.network,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'get-cast',
      functionArgs: [uintCV(castId)],
      senderAddress,
    });

    return cvToJSON(result);
  }

  /**
   * Read-only: Get channel
   */
  async getChannel(channelId: number, senderAddress: string) {
    const result = await callReadOnlyFunction({
      network: this.config.network,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'get-channel',
      functionArgs: [uintCV(channelId)],
      senderAddress,
    });

    return cvToJSON(result);
  }

  /**
   * Read-only: Check if following
   */
  async isFollowing(follower: string, following: string) {
    const result = await callReadOnlyFunction({
      network: this.config.network,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'is-following',
      functionArgs: [principalCV(follower), principalCV(following)],
      senderAddress: follower,
    });

    return cvToJSON(result);
  }

  /**
   * Read-only: Check if liked cast
   */
  async hasLikedCast(castId: number, userAddress: string) {
    const result = await callReadOnlyFunction({
      network: this.config.network,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'has-liked-cast',
      functionArgs: [uintCV(castId), principalCV(userAddress)],
      senderAddress: userAddress,
    });

    return cvToJSON(result);
  }

  /**
   * Read-only: Get platform stats
   */
  async getPlatformStats(senderAddress: string) {
    const result = await callReadOnlyFunction({
      network: this.config.network,
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName: 'get-platform-stats',
      functionArgs: [],
      senderAddress,
    });

    return cvToJSON(result);
  }
}

// Helper to create contract instance
export function createSocialPlatformContract(config: ContractConfig): SocialPlatformContract {
  return new SocialPlatformContract(config);
}
