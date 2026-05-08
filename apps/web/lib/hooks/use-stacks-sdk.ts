'use client';

import { useMemo } from 'react';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import type { StaxialConfig } from '@/lib/types/sdk';

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
