'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userSession } from '@/lib/stacks-config';

export interface WalletState {
  connected: boolean;
  address: string | null;
  stxBalance: number;       // microSTX
  userData: unknown | null;
}

export function useWallet(): WalletState {
  const [state, setState] = React.useState<WalletState>({
    connected: false,
    address: null,
    stxBalance: 0,
    userData: null,
  });

  React.useEffect(() => {
    const isSignedIn = userSession.isUserSignedIn();
    if (isSignedIn) {
      const data = userSession.loadUserData();
      const addr = data?.profile?.stxAddress?.testnet ?? data?.profile?.stxAddress?.mainnet ?? null;
      setState({ connected: true, address: addr, stxBalance: 0, userData: data });
    }
  }, []);

  return state;
}

export function useSTXBalance(address: string | null) {
  return useQuery({
    queryKey: ['stx-balance', address],
    queryFn: async () => {
      if (!address) return 0;
      try {
        const res = await fetch(
          `https://stacks-node-api.testnet.stacks.co/v2/accounts/${address}`
        );
        const json = await res.json();
        return parseInt(json.balance, 16);
      } catch {
        return 0;
      }
    },
    enabled: !!address,
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}
