'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/toast';
import type { Cast } from '@/lib/types/social';

function optimisticToggle(
  old: Cast[] | undefined,
  castId: string,
  field: 'isLiked' | 'isRecasted' | 'isBookmarked',
  countField: 'likesCount' | 'recastsCount' | 'repliesCount' | 'tipsCount',
) {
  if (!old) return old;
  return old.map(c =>
    c.id === castId
      ? { ...c, [field]: !c[field], [countField]: c[field] ? (c[countField] as number) - 1 : (c[countField] as number) + 1 }
      : c,
  );
}

export function useLikeCast() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ castId, liked }: { castId: string; liked: boolean }) => {
      // wire: liked ? contract.unlikeCast(+castId) : contract.likeCast(+castId)
      await new Promise(r => setTimeout(r, 100));
    },
    onMutate: async ({ castId, liked }) => {
      await qc.cancelQueries({ queryKey: ['feed'] });
      const prev = qc.getQueryData<Cast[]>(['feed', 'for-you']);
      qc.setQueryData(['feed', 'for-you'], (old: Cast[] | undefined) =>
        optimisticToggle(old, castId, 'isLiked', 'likesCount')
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(['feed', 'for-you'], ctx?.prev);
      toast({ type: 'error', title: 'Action failed', description: 'Please try again.' });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  });
}

export function useRecast() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ castId, recasted }: { castId: string; recasted: boolean }) => {
      await new Promise(r => setTimeout(r, 100));
    },
    onMutate: async ({ castId }) => {
      const prev = qc.getQueryData<Cast[]>(['feed', 'for-you']);
      qc.setQueryData(['feed', 'for-you'], (old: Cast[] | undefined) =>
        optimisticToggle(old, castId, 'isRecasted', 'recastsCount')
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(['feed', 'for-you'], ctx?.prev);
      toast({ type: 'error', title: 'Recast failed' });
    },
    onSuccess: () => toast({ type: 'success', title: 'Recasted!' }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  });
}

export function useTipCast() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ castId, amountStx, sender }: { castId: string; amountStx: number; sender: string }) => {
      // wire: contract.tipCast(+castId, amountStx * 1_000_000, sender)
      await new Promise(r => setTimeout(r, 1200));
      return amountStx;
    },
    onSuccess: (amount) => toast({
      type: 'success',
      title: `Tipped ${amount} STX!`,
      description: 'Transaction submitted to Stacks.',
    }),
    onError: () => toast({ type: 'error', title: 'Tip failed', description: 'Check your wallet balance.' }),
  });
}

export function useBookmarkCast() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ castId, bookmarked }: { castId: string; bookmarked: boolean }) => {
      await new Promise(r => setTimeout(r, 100));
    },
    onMutate: async ({ castId }) => {
      const prev = qc.getQueryData<Cast[]>(['feed', 'for-you']);
      qc.setQueryData(['feed', 'for-you'], (old: Cast[] | undefined) =>
        optimisticToggle(old, castId, 'isBookmarked', 'repliesCount')
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(['feed', 'for-you'], ctx?.prev);
    },
    onSuccess: (_, { bookmarked }) =>
      toast({ type: 'success', title: bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks' }),
  });
}

export function useCreateCast() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (args: {
      content: string;
      imagesIpfs: string[];
      mentions: string[];
      parentCastId?: number;
      channelId?: number;
    }) => {
      // wire: contract.createCast(...)
      await new Promise(r => setTimeout(r, 900));
      return 'mock-cast-id';
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      toast({ type: 'success', title: 'Cast published!', description: 'Confirming on Stacks…' });
    },
    onError: () => toast({ type: 'error', title: 'Failed to cast', description: 'Please try again.' }),
  });
}
