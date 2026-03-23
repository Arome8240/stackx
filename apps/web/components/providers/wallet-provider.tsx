'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { showConnect, type FinishedAuthData } from '@stacks/connect';

type NetworkName = 'mainnet' | 'testnet';

const networkName: NetworkName =
  (process.env.NEXT_PUBLIC_STACKS_NETWORK as NetworkName) ?? 'mainnet';

interface WalletState {
  address: string | null;
  network: NetworkName;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

function resolveAddress(data: FinishedAuthData): string {
  const profile = data.userSession.loadUserData().profile;
  return networkName === 'mainnet' ? profile.stxAddress.mainnet : profile.stxAddress.testnet;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(() => {
    showConnect({
      appDetails: { name: 'HealthChain', icon: '/icon.png' },
      network: networkName,
      onFinish: (data: FinishedAuthData) => setAddress(resolveAddress(data)),
      onCancel: () => {},
    });
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  return (
    <WalletContext.Provider value={{ address, network: networkName, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
}
