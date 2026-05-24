'use client';

import { useQuery } from '@tanstack/react-query';
import type { PlatformStats } from '@/lib/types/social';

export function usePlatformStats(senderAddress: string | null) {
  return useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async (): Promise<PlatformStats> => ({
      totalUsers: 42_184,
      totalCasts: 1_284_000,
      totalChannels: 3_200,
      totalNfts: 8_900,
      totalPolls: 1_200,
      platformTreasury: 184_500_000,
    }),
    staleTime: 300_000,
    enabled: !!senderAddress,
  });
}
