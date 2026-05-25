'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Cast } from '@/lib/types/social';

export function useCastDetail(castId: string | undefined) {
  return useQuery({
    queryKey: ['cast', castId],
    queryFn: () => api.get<Cast>(`/casts/${castId}`),
    enabled: !!castId,
    staleTime: 30_000,
  });
}

export function useCastReplies(castId: string | undefined) {
  return useQuery({
    queryKey: ['cast-replies', castId],
    queryFn: () => api.get<Cast[]>(`/casts/${castId}/replies`),
    enabled: !!castId,
  });
}

export function useLikeCast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (castId: string) => api.post(`/casts/${castId}/like`, {}),
    onSuccess: (_, castId) => {
      qc.invalidateQueries({ queryKey: ['cast', castId] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useUnlikeCast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (castId: string) => api.delete(`/casts/${castId}/like`),
    onSuccess: (_, castId) => {
      qc.invalidateQueries({ queryKey: ['cast', castId] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteCast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (castId: string) => api.delete(`/casts/${castId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
