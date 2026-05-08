export type ID = string;

export interface SocialUser {
  id: ID;
  handle: string; // e.g. "stackx.aria"
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface SocialChannel {
  id: ID;
  slug: string; // e.g. "builders"
  name: string; // e.g. "Builders"
  description?: string;
  memberCount: number;
}

export interface SocialCast {
  id: ID;
  authorId: ID;
  channelId?: ID;
  parentId?: ID; // reply-to cast id
  text: string;
  createdAt: string; // ISO
  replyCount: number;
  likeCount: number;
  recastCount: number;
  viewerHasLiked?: boolean;
}

export interface SocialNotification {
  id: ID;
  type: 'reply' | 'mention' | 'like' | 'follow';
  createdAt: string; // ISO
  actorUserId: ID;
  castId?: ID;
  read: boolean;
}

export interface FeedItem {
  cast: SocialCast;
  author: SocialUser;
  channel?: SocialChannel;
  parent?: {
    cast: SocialCast;
    author: SocialUser;
  };
}

