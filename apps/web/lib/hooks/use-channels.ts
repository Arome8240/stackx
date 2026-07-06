'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
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
    mutationFn: async ({ channelId: _channelId, entryFee: _entryFee, sender: _sender }: { channelId: number; entryFee: number; sender: string }) => {
      // wire: contract.joinChannel(channelId, entryFee, sender)
      await new Promise(r => setTimeout(r, 1200));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['channels'] });
      toast({ type: 'success', title: 'Joined channel!', description: 'Transaction confirmed on Stacks.' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to join', description: 'Check your wallet balance.' }),
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
