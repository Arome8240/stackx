'use client';

import { useState } from 'react';
import { mockConversations, mockMessages } from '@/lib/mock-data/messages';
import { mockUsers } from '@/lib/mock-data/users';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');

  const currentUser = mockUsers[6]; // Alice
  const otherParticipant = mockUsers.find(
    (u) => selectedConversation.participants.includes(u.id) && u.id !== currentUser.id
  );

  const conversationMessages = mockMessages.filter(
    (m) => m.conversationId === selectedConversation.id
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // TODO: Send message to blockchain
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleSendTip = () => {
    if (tipAmount && parseFloat(tipAmount) > 0) {
      // TODO: Send tip transaction
      console.log('Sending tip:', tipAmount);
      setShowTipModal(false);
      setTipAmount('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen max-h-screen">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => {
            const participant = mockUsers.find(
              (u) => conversation.participants.includes(u.id) && u.id !== currentUser.id
            );
            if (!participant) return null;

            return (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors border-b border-border ${
                  selectedConversation.id === conversation.id ? 'bg-accent' : ''
                }`}
              >
                <img
                  src={participant.avatar}
                  alt={participant.displayName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold truncate">{participant.displayName}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={otherParticipant?.avatar}
              alt={otherParticipant?.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{otherParticipant?.displayName}</p>
              <p className="text-sm text-muted-foreground">@{otherParticipant?.username}</p>
            </div>
          </div>
          <button
            onClick={() => setShowTipModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            💰 Send Tip
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversationMessages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = mockUsers.find((u) => u.id === message.senderId);

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={sender?.avatar}
                  alt={sender?.displayName}
                  className="w-8 h-8 rounded-full"
                />
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : ''}`}>
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.tip && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <p className="text-sm font-semibold">
                          💰 Tip: {message.tip.amount} {message.tip.token}
                        </p>
                        {message.tip.txHash && (
                          <p className="text-xs opacity-70 truncate">
                            Tx: {message.tip.txHash}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-input border border-border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Send Tip</h2>
              <button
                onClick={() => setShowTipModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Send a tip to @{otherParticipant?.username}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (STX)</label>
                  <input
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex gap-2">
                  {[1, 5, 10, 25].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount.toString())}
                      className="flex-1 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                    >
                      {amount} STX
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTipModal(false)}
                className="flex-1 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTip}
                disabled={!tipAmount || parseFloat(tipAmount) <= 0}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Send Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
