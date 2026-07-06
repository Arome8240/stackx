'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import type { Poll } from '@/lib/types/social';

export function usePoll(castId: string | undefined) {
  return useQuery<Poll>({
    queryKey: ['poll', castId],
    queryFn: () => api.get<Poll>(`/polls/cast/${castId}`),
    enabled: !!castId,
    staleTime: 15_000,
  });
}

export function useMyVote(pollId: string | undefined) {
  return useQuery<number | null>({
    queryKey: ['poll-vote', pollId],
    queryFn: () => api.get(`/polls/${pollId}/my-vote`),
    enabled: !!pollId,
    staleTime: Infinity,
  });
}

export function useVotePoll() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) =>
      api.post(`/polls/${pollId}/vote`, { optionIndex }),
    onSuccess: (_, { pollId }) => {
      qc.invalidateQueries({ queryKey: ['poll', pollId] });
      qc.invalidateQueries({ queryKey: ['poll-vote', pollId] });
    },
    onError: (err: Error) => {
      toast({ type: 'error', title: 'Vote failed', description: err.message });
    },
  });
}
