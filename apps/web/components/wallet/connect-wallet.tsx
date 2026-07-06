'use client';

import { useConnect } from '@stacks/connect-react';
import { userSession } from '@/lib/stacks-config';
import { Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ConnectWallet() {
  const { doOpenAuth } = useConnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleConnect = () => {
    doOpenAuth();
  };

  const handleDisconnect = () => {
    userSession.signUserOut();
    window.location.reload();
  };

  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    const address = userData.profile.stxAddress.testnet; // Adjust for mainnet if needed
    const shortAddress = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

    return (
      <button
        onClick={handleDisconnect}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors w-full"
      >
        <Wallet className="w-4 h-4" />
        <span>{shortAddress}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors w-full"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
}
