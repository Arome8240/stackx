export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  tip?: {
    amount: number;
    token: string;
    txHash?: string;
  };
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'games' | 'defi' | 'nft' | 'social' | 'tools';
  url: string;
  verified: boolean;
}
