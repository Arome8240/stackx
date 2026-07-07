'use client';

import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from './use-auth';

export interface WalletState {
  connected: boolean;
  address: string | null;
  stxBalance: number; // microSTX — always 0 here, see useSTXBalance for a live balance
  userData: unknown | null;
}

/** Wallet identity now comes from the backend session — StackX holds custody, not the browser. */
export function useWallet(): WalletState {
  const { data: user } = useCurrentUser();
  return {
    connected: !!user,
    address: user?.stxAddress ?? null,
    stxBalance: 0,
    userData: user ?? null,
  };
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
