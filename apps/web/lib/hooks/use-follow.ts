'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useFollowStatus(targetUserId: string | undefined) {
  return useQuery({
    queryKey: ['follow-status', targetUserId],
    queryFn: () => api.get<{ isFollowing: boolean }>(`/feed/following-status/${targetUserId}`),
    enabled: !!targetUserId,
    staleTime: 30_000,
  });
}

export function useFollow(targetUserId: string) {
  const qc = useQueryClient();

  const follow = useMutation({
    mutationFn: () => api.post(`/feed/follow/${targetUserId}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['follow-status', targetUserId] });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const unfollow = useMutation({
    mutationFn: () => api.delete(`/feed/follow/${targetUserId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['follow-status', targetUserId] });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return { follow, unfollow };
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => api.get<unknown[]>(`/feed/followers/${userId}`),
    enabled: !!userId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => api.get<unknown[]>(`/feed/following/${userId}`),
    enabled: !!userId,
  });
}
