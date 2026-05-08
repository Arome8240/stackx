export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  banner?: string;
  walletAddress: string;
  followersCount: number;
  followingCount: number;
  castsCount: number;
  verified: boolean;
  joinedAt: string;
}

export interface Cast {
  id: string;
  author: User;
  content: string;
  images?: string[];
  mentions?: string[];
  timestamp: string;
  likesCount: number;
  recastsCount: number;
  repliesCount: number;
  isLiked?: boolean;
  isRecasted?: boolean;
  parentCastId?: string;
  channelId?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  image: string;
  membersCount: number;
  castsCount: number;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'recast' | 'reply' | 'mention';
  from: User;
  cast?: Cast;
  timestamp: string;
  read: boolean;
}
