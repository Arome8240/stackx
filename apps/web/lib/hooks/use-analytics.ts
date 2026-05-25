'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export interface PlatformStats {
  totalUsers: number;
  totalCasts: number;
  totalChannels: number;
  activeLast24h: number;
  castsLast24h: number;
}

export function usePlatformStatsApi() {
  return useQuery<PlatformStats>({
    queryKey: ['analytics', 'platform'],
    queryFn: () => api.get<PlatformStats>('/analytics/platform'),
    staleTime: 60_000,
  });
}

export function useTrendingCastsApi(limit = 10) {
  return useQuery({
    queryKey: ['analytics', 'trending-casts', limit],
    queryFn: () => api.get(`/analytics/trending/casts?limit=${limit}`),
    staleTime: 30_000,
  });
}

export function useTrendingChannelsApi(limit = 5) {
  return useQuery({
    queryKey: ['analytics', 'trending-channels', limit],
    queryFn: () => api.get(`/analytics/trending/channels?limit=${limit}`),
    staleTime: 60_000,
  });
}

export function useTopContributorsApi(limit = 10) {
  return useQuery({
    queryKey: ['analytics', 'top-contributors', limit],
    queryFn: () => api.get(`/analytics/contributors/top?limit=${limit}`),
    staleTime: 60_000,
  });
}
