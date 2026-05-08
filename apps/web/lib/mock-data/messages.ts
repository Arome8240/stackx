import { Message, Conversation, MiniApp } from '../types/messages';
import { mockUsers } from './users';

export const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: 'conv-1',
    senderId: mockUsers[0].id,
    receiverId: mockUsers[6].id,
    content: 'Hey! Love your recent post about decentralized social networks.',
    timestamp: '2024-01-20T10:30:00Z',
    read: true,
  },
  {
    id: '2',
    conversationId: 'conv-1',
    senderId: mockUsers[6].id,
    receiverId: mockUsers[0].id,
    content: 'Thanks! Really appreciate it. Have you tried building on Stacks?',
    timestamp: '2024-01-20T10:35:00Z',
    read: true,
  },
  {
    id: '3',
    conversationId: 'conv-1',
    senderId: mockUsers[0].id,
    receiverId: mockUsers[6].id,
    content: 'Yes! Here\'s a small tip for your great work 🎉',
    timestamp: '2024-01-20T10:40:00Z',
    read: true,
    tip: {
      amount: 10,
      token: 'STX',
      txHash: '0x1234...5678',
    },
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [mockUsers[0].id, mockUsers[6].id],
    lastMessage: mockMessages[2],
    unreadCount: 0,
  },
  {
    id: 'conv-2',
    participants: [mockUsers[1].id, mockUsers[6].id],
    lastMessage: {
      id: '4',
      conversationId: 'conv-2',
      senderId: mockUsers[1].id,
      receiverId: mockUsers[6].id,
      content: 'Let\'s collaborate on the next protocol upgrade!',
      timestamp: '2024-01-19T18:20:00Z',
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: 'conv-3',
    participants: [mockUsers[2].id, mockUsers[6].id],
    lastMessage: {
      id: '5',
      conversationId: 'conv-3',
      senderId: mockUsers[2].id,
      receiverId: mockUsers[6].id,
      content: 'Check out this new Base feature!',
      timestamp: '2024-01-19T14:15:00Z',
      read: true,
    },
    unreadCount: 0,
  },
];

export const mockMiniApps: MiniApp[] = [
  {
    id: '1',
    name: 'Token Swap',
    description: 'Swap tokens directly in the app',
    icon: '🔄',
    category: 'defi',
    url: '/mini-apps/swap',
    verified: true,
  },
  {
    id: '2',
    name: 'NFT Gallery',
    description: 'View and showcase your NFT collection',
    icon: '🖼️',
    category: 'nft',
    url: '/mini-apps/nft-gallery',
    verified: true,
  },
  {
    id: '3',
    name: 'Poker Game',
    description: 'Play poker with friends and earn tokens',
    icon: '🃏',
    category: 'games',
    url: '/mini-apps/poker',
    verified: true,
  },
  {
    id: '4',
    name: 'Staking Pool',
    description: 'Stake your tokens and earn rewards',
    icon: '💰',
    category: 'defi',
    url: '/mini-apps/staking',
    verified: true,
  },
  {
    id: '5',
    name: 'Poll Creator',
    description: 'Create and vote on community polls',
    icon: '📊',
    category: 'social',
    url: '/mini-apps/polls',
    verified: false,
  },
  {
    id: '6',
    name: 'Tip Calculator',
    description: 'Calculate tips and split bills',
    icon: '🧮',
    category: 'tools',
    url: '/mini-apps/calculator',
    verified: false,
  },
];
