'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { PLATFORM_FEE_BPS } from '@/lib/constants';

interface PlatformSettings {
  platformFeeBps: number;
  minTipMicroStx: number;
  maxImagesPerCast: number;
  maxCastLength: number;
  stacksNetwork: string;
  contractAddress: string;
  contractName: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformFeeBps: PLATFORM_FEE_BPS,
  minTipMicroStx: 1_000_000,
  maxImagesPerCast: 4,
  maxCastLength: 320,
  stacksNetwork: 'testnet',
  contractAddress: '',
  contractName: 'social-platform-v2',
};

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      try {
        return await api.get<PlatformSettings>('/analytics/platform-settings');
      } catch {
        return DEFAULT_SETTINGS;
      }
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
