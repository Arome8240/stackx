import type { FeedItem, ID, SocialCast, SocialChannel, SocialNotification, SocialUser } from './types';

function iso(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function id(prefix: string, n: number): ID {
  return `${prefix}_${n}`;
}

export interface MockDB {
  meId: ID;
  users: SocialUser[];
  channels: SocialChannel[];
  casts: SocialCast[];
  notifications: SocialNotification[];
}

export const db: MockDB = {
  meId: id('user', 1),
  users: [
    {
      id: id('user', 1),
      handle: 'you.stackx',
      displayName: 'You',
      bio: 'Building in public.',
      followerCount: 128,
      followingCount: 94,
      isFollowing: false,
    },
    {
      id: id('user', 2),
      handle: 'stackx.aria',
      displayName: 'Aria',
      bio: 'Designing fast social products.',
      followerCount: 8420,
      followingCount: 412,
      isFollowing: true,
    },
    {
      id: id('user', 3),
      handle: 'sol.dev',
      displayName: 'Sol Dev',
      bio: 'Protocols, tooling, and small wins.',
      followerCount: 2201,
      followingCount: 301,
      isFollowing: true,
    },
    {
      id: id('user', 4),
      handle: 'meme.engineer',
      displayName: 'Meme Engineer',
      bio: 'Ship fast, laugh later.',
      followerCount: 14002,
      followingCount: 98,
      isFollowing: false,
    },
  ],
  channels: [
    { id: id('chan', 1), slug: 'builders', name: 'Builders', description: 'Shipping updates, learnings, asks.', memberCount: 14823 },
    { id: id('chan', 2), slug: 'design', name: 'Design', description: 'Interface craft and systems.', memberCount: 6221 },
    { id: id('chan', 3), slug: 'random', name: 'Random', description: 'Everything else.', memberCount: 19002 },
  ],
  casts: [
    {
      id: id('cast', 1),
      authorId: id('user', 2),
      channelId: id('chan', 1),
      text: 'Shipping the mock UI first so the product loop is perfect before we wire backend/contracts. Feels way faster already.',
      createdAt: iso(7),
      replyCount: 18,
      likeCount: 142,
      recastCount: 4,
      viewerHasLiked: true,
    },
    {
      id: id('cast', 2),
      authorId: id('user', 3),
      channelId: id('chan', 1),
      text: 'If your feed feels slow, measure: TTFB, hydration, and list virtualization. Fixing 2 of 3 usually makes it “instant”.',
      createdAt: iso(22),
      replyCount: 6,
      likeCount: 88,
      recastCount: 2,
      viewerHasLiked: false,
    },
    {
      id: id('cast', 3),
      authorId: id('user', 4),
      channelId: id('chan', 3),
      text: 'Hot take: “polish” is just removing one extra decision per screen.',
      createdAt: iso(54),
      replyCount: 3,
      likeCount: 61,
      recastCount: 1,
      viewerHasLiked: false,
    },
    {
      id: id('cast', 4),
      authorId: id('user', 1),
      channelId: id('chan', 1),
      text: 'Today: mock data end-to-end. Tomorrow: swap in real API. Keep the UI identical.',
      createdAt: iso(120),
      replyCount: 2,
      likeCount: 24,
      recastCount: 0,
      viewerHasLiked: false,
    },
    // Replies (thread under cast_1)
    {
      id: id('cast', 5),
      parentId: id('cast', 1),
      authorId: id('user', 3),
      text: 'This is the way. If the UX is right, backend work becomes mostly plumbing.',
      createdAt: iso(5),
      replyCount: 1,
      likeCount: 11,
      recastCount: 0,
      viewerHasLiked: false,
    },
    {
      id: id('cast', 6),
      parentId: id('cast', 5),
      authorId: id('user', 2),
      text: 'Exactly. Also we can test empty/loading/error states properly without guessing.',
      createdAt: iso(4),
      replyCount: 0,
      likeCount: 6,
      recastCount: 0,
      viewerHasLiked: false,
    },
  ],
  notifications: [
    { id: id('notif', 1), type: 'reply', actorUserId: id('user', 3), castId: id('cast', 1), createdAt: iso(6), read: false },
    { id: id('notif', 2), type: 'like', actorUserId: id('user', 4), castId: id('cast', 4), createdAt: iso(70), read: false },
    { id: id('notif', 3), type: 'follow', actorUserId: id('user', 2), createdAt: iso(180), read: true },
  ],
};

export function getUserById(userId: ID) {
  return db.users.find((u) => u.id === userId);
}

export function getChannelById(channelId: ID) {
  return db.channels.find((c) => c.id === channelId);
}

export function getCastById(castId: ID) {
  return db.casts.find((c) => c.id === castId);
}

export function enrichCast(cast: SocialCast): FeedItem {
  const author = getUserById(cast.authorId);
  if (!author) throw new Error(`Missing author for cast ${cast.id}`);
  const channel = cast.channelId ? getChannelById(cast.channelId) : undefined;
  const parentCast = cast.parentId ? getCastById(cast.parentId) : undefined;
  const parentAuthor = parentCast ? getUserById(parentCast.authorId) : undefined;
  return {
    cast,
    author,
    channel,
    parent:
      parentCast && parentAuthor
        ? {
            cast: parentCast,
            author: parentAuthor,
          }
        : undefined,
  };
}

