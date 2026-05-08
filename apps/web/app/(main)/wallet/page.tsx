'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/lib/mock-data/users';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'assets' | 'activity' | 'send' | 'receive'>('assets');
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const currentUser = getCurrentUser();

  // Mock wallet data
  const walletData = {
    address: currentUser.walletAddress,
    balance: {
      stx: 1250.50,
      usd: 625.25,
    },
    tokens: [
      { symbol: 'STX', name: 'Stacks', balance: 1250.50, usdValue: 625.25, icon: '🟣' },
      { symbol: 'ALEX', name: 'Alex', balance: 5000, usdValue: 150.00, icon: '🔷' },
      { symbol: 'DIKO', name: 'Arkadiko', balance: 2500, usdValue: 75.00, icon: '🔶' },
    ],
    recentActivity: [
      { id: '1', type: 'receive', amount: 10, token: 'STX', from: 'SP2J6ZY...', timestamp: '2024-01-20T10:30:00Z', status: 'completed' },
      { id: '2', type: 'send', amount: 5, token: 'STX', to: 'SP3FBR2A...', timestamp: '2024-01-19T15:20:00Z', status: 'completed' },
      { id: '3', type: 'swap', amount: 100, token: 'ALEX', timestamp: '2024-01-19T12:10:00Z', status: 'completed' },
      { id: '4', type: 'receive', amount: 25, token: 'STX', from: 'SP1HTBVD...', timestamp: '2024-01-18T09:45:00Z', status: 'completed' },
    ],
  };

  const handleSend = () => {
    if (sendAmount && sendAddress) {
      // TODO: Send transaction
      console.log('Sending:', sendAmount, 'to', sendAddress);
      setSendAmount('');
      setSendAddress('');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your crypto assets</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-purple-500 rounded-xl p-6 mb-6 text-white">
        <p className="text-sm opacity-80 mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold mb-4">${walletData.balance.usd.toFixed(2)}</h2>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <span>{walletData.balance.stx.toFixed(2)} STX</span>
          <span>•</span>
          <span className="font-mono">{formatAddress(walletData.address)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => setActiveTab('send')}
          className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-accent transition-colors"
        >
          <span className="text-2xl">📤</span>
          <span className="text-sm font-medium">Send</span>
        </button>
        <button
          onClick={() => setActiveTab('receive')}
          className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-accent transition-colors"
        >
          <span className="text-2xl">📥</span>
          <span className="text-sm font-medium">Receive</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-accent transition-colors">
          <span className="text-2xl">🔄</span>
          <span className="text-sm font-medium">Swap</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:bg-accent transition-colors">
          <span className="text-2xl">💰</span>
          <span className="text-sm font-medium">Stake</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {(['assets', 'activity', 'send', 'receive'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-3">
          {walletData.tokens.map((token) => (
            <div
              key={token.symbol}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-2xl">
                  {token.icon}
                </div>
                <div>
                  <p className="font-semibold">{token.name}</p>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{token.balance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">${token.usdValue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-3">
          {walletData.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'receive' ? 'bg-green-500/20 text-green-500' :
                  activity.type === 'send' ? 'bg-red-500/20 text-red-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {activity.type === 'receive' ? '↓' : activity.type === 'send' ? '↑' : '↔'}
                </div>
                <div>
                  <p className="font-semibold capitalize">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {activity.type === 'send' ? '-' : '+'}{activity.amount} {activity.token}
                </p>
                <p className="text-sm text-green-500">{activity.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Tab */}
      {activeTab === 'send' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Send Tokens</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recipient Address</label>
              <input
                type="text"
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                placeholder="SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
                className="w-full bg-input border border-border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 pr-16 outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  STX
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Balance: {walletData.balance.stx} STX
              </p>
            </div>
            <button
              onClick={handleSend}
              disabled={!sendAmount || !sendAddress}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Receive Tab */}
      {activeTab === 'receive' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Receive Tokens</h3>
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 bg-white rounded-xl p-4 mb-4">
              {/* QR Code placeholder */}
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">QR Code</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Your Wallet Address</p>
            <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-lg">
              <code className="font-mono text-sm">{walletData.address}</code>
              <button className="text-primary hover:opacity-80">
                📋
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
