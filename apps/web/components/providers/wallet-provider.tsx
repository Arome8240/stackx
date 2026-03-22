'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { showConnect, type FinishedAuthData } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

export const network =
  process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

interface WalletState {
  address: string | null;
  network: typeof network;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

function resolveAddress(data: FinishedAuthData): string {
  const profile = data.userSession.loadUserData().profile;
  return network instanceof StacksMainnet ? profile.stxAddress.mainnet : profile.stxAddress.testnet;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(() => {
    showConnect({
      appDetails: { name: 'HealthChain', icon: '/icon.png' },
      onFinish: (data: FinishedAuthData) => setAddress(resolveAddress(data)),
      onCancel: () => {},
    });
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return (
    <WalletContext.Provider value={{ address, network, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
}
