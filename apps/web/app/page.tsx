'use client';

import { ConnectWallet } from '@/components/connect-wallet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Redirect to feed if user is "logged in" (for demo purposes)
  useEffect(() => {
    // In a real app, check if wallet is connected
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      router.push('/feed');
    }
  }, [router]);

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    router.push('/feed');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          StackX
        </h1>
        <p className="text-2xl text-foreground mb-4">
          A wallet-first social feed
        </p>
        <p className="text-muted-foreground mb-12 text-lg">
          Decentralized social media built on Stacks blockchain. Own your identity, control your data, connect with your community.
        </p>
        
        <div className="flex gap-4 justify-center mb-16">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
          <ConnectWallet />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔐 Own Your Identity</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet is your identity. No email, no password, just you.
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🌐 Decentralized</h3>
            <p className="text-sm text-muted-foreground">
              Built on Stacks blockchain. No central authority, no censorship.
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">💬 Connect</h3>
            <p className="text-sm text-muted-foreground">
              Join channels, follow users, and engage with your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
