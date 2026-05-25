'use client';

import * as React from 'react';

interface WalletContextValue {
  address: string | null;
  connected: boolean;
}

const WalletContext = React.createContext<WalletContextValue>({ address: null, connected: false });

export function useWalletContext() {
  return React.useContext(WalletContext);
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = React.useState<string | null>(null);

  React.useEffect(() => {
    const stored = localStorage.getItem('wallet-address');
    if (stored) setAddress(stored);
  }, []);

  return (
    <WalletContext.Provider value={{ address, connected: !!address }}>
      {children}
    </WalletContext.Provider>
  );
}
