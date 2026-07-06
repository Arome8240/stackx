'use client';

import { useMemo } from 'react';
import { STACKS_TESTNET, STACKS_MAINNET, type StacksNetwork } from '@stacks/network';

/**
 * Minimal config shape consumed by our local contract-call helpers
 * (see `use-contract-call.ts`). Inlined here since it's only used by this
 * hook and its one consumer — no `lib/types/sdk.ts` module exists (or is
 * needed) for it.
 */
export interface StaxialConfig {
  network: StacksNetwork;
  contractAddress: string;
  contractName: string;
  stacksApiUrl: string;
}

export function useStacksSDK() {
  const config: StaxialConfig = useMemo(() => {
    const network = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' 
      ? STACKS_MAINNET 
      : STACKS_TESTNET;
    
    return {
      network,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
      contractName: 'staxial-health',
      stacksApiUrl: process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so',
    };
  }, []);

  return config;
}
