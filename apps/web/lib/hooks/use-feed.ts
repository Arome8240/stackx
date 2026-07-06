'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Cast } from '@/lib/types/social';

const PAGE_SIZE = 20;

async function fetchFeed(_page: number, _tab: 'for-you' | 'following'): Promise<Cast[]> {
  // In production: call contract read-only or indexer API
  // Returns mocked data for now
  await new Promise(r => setTimeout(r, 400));
  return [];
}

export function useFeed(tab: 'for-you' | 'following' = 'for-you') {
  return useInfiniteQuery({
    queryKey: ['feed', tab],
    queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam as number, tab),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === PAGE_SIZE ? pages.length : undefined,
    initialPageParam: 0,
    staleTime: 30_000,
  });
}

export function useCast(castId: string) {
  return useQuery<Cast | null>({
    queryKey: ['cast', castId],
    queryFn: async () => null, // wire to contract.getCast(castId)
    staleTime: 60_000,
  });
}

export function useCastReplies(castId: string) {
  return useQuery<Cast[]>({
    queryKey: ['cast-replies', castId],
    queryFn: async () => [],
    staleTime: 30_000,
  });
}
