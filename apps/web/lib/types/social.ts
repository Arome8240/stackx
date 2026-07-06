export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  website?: string;
  location?: string;
  avatarUrl: string;
  banner?: string;
  walletAddress: string;
  followersCount: number;
  followingCount: number;
  castsCount: number;
  tipsReceived: number;
  nftsMinted: number;
  isVerified: boolean;
  tier: 0 | 1 | 2; // 0=free 1=pro 2=creator
  joinedAt: string;
}

export interface Poll {
  id: string;
  castId: string;
  question: string;
  options: Array<{ label: string; votes: number }>;
  totalVotes: number;
  endsAt: string;
  closed: boolean;
  userVote?: number;
}

export interface Cast {
  id: string;
  author: User;
  content: string;
  images?: string[];
  mentions?: string[];
  timestamp: string;
  blockHeight: number;
  likesCount: number;
  recastsCount: number;
  repliesCount: number;
  tipsCount: number;
  tipsTotal: number;
  nftId?: string;
  poll?: Poll;
  isLiked?: boolean;
  isRecasted?: boolean;
  isBookmarked?: boolean;
  parentCastId?: string;
  rootCastId?: string;
  channelId?: string;
  deleted?: boolean;
  pinned?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  isPaid: boolean;
  entryFee: number;
  membersCount: number;
  castsCount: number;
  revenueTotal: number;
  isNsfw: boolean;
  isPrivate: boolean;
  createdAt: string;
  isMember?: boolean;
}

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'recast' | 'reply' | 'mention' | 'tip';
  from: User;
  cast?: Cast;
  amount?: number;
  timestamp: string;
  read: boolean;
}

export interface NFTListing {
  nftId: string;
  castId: string;
  seller: User;
  price: number;
  listedAt: string;
  uri: string;
  edition: number;
  maxEdition: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalCasts: number;
  totalChannels: number;
  totalNfts: number;
  totalPolls: number;
  platformTreasury: number;
}
