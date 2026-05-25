'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface TipStats {
  sent: { total: number; count: number };
  received: { total: number; count: number };
}

export function useMyTipStats() {
  return useQuery<TipStats>({
    queryKey: ['tips', 'stats', 'me'],
    queryFn: () => api.get<TipStats>('/tips/stats/me'),
    staleTime: 30_000,
  });
}

export function useUserTipStats(userId: string | null) {
  return useQuery<TipStats>({
    queryKey: ['tips', 'stats', userId],
    queryFn: () => api.get<TipStats>(`/tips/stats/${userId}`),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useSentTips(page = 1) {
  return useQuery({
    queryKey: ['tips', 'sent', page],
    queryFn: () => api.get(`/tips/sent?page=${page}`),
    staleTime: 30_000,
  });
}

export function useReceivedTips(page = 1) {
  return useQuery({
    queryKey: ['tips', 'received', page],
    queryFn: () => api.get(`/tips/received?page=${page}`),
    staleTime: 30_000,
  });
}
