'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';

export function useBookmarks(page = 1) {
  return useQuery({
    queryKey: ['bookmarks', page],
    queryFn: () => api.get(`/bookmarks?page=${page}`),
    staleTime: 30_000,
  });
}

export function useAddBookmark() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (castId: string) => api.post(`/bookmarks/${castId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({ type: 'success', title: 'Bookmarked!' });
    },
    onError: () => {
      toast({ type: 'error', title: 'Failed to bookmark' });
    },
  });
}

export function useRemoveBookmark() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (castId: string) => api.delete(`/bookmarks/${castId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useClearBookmarks() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => api.delete('/bookmarks'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({ type: 'success', title: 'All bookmarks cleared' });
    },
  });
}
