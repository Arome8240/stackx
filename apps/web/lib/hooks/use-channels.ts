'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api-client';
import type { Channel } from '@/lib/types/social';

export function useChannels() {
  return useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => [],
    staleTime: 120_000,
  });
}

export function useChannel(channelId: string) {
  return useQuery<Channel | null>({
    queryKey: ['channel', channelId],
    queryFn: async () => null,
    staleTime: 60_000,
    enabled: !!channelId,
  });
}

export function useJoinChannel() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (channelId: string) => api.post<void>(`/channels/${channelId}/join`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['channels'] });
      toast({ type: 'success', title: 'Joined channel!' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to join' }),
  });
}

export function useCreateChannel() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (_args: {
      name: string; description: string; imageIpfs: string;
      entryFee: number; isNsfw: boolean; isPrivate: boolean;
    }) => {
      await new Promise(r => setTimeout(r, 900));
      return 1;
    },
    onSuccess: (channelId) => {
      qc.invalidateQueries({ queryKey: ['channels'] });
      toast({ type: 'success', title: `Channel created! ID: ${channelId}` });
    },
    onError: () => toast({ type: 'error', title: 'Failed to create channel' }),
  });
}
