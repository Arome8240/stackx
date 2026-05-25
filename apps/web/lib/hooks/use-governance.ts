'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';

export function useProposals(status?: string) {
  return useQuery({
    queryKey: ['proposals', status],
    queryFn: () => api.get(`/governance${status ? `?status=${status}` : ''}`),
    staleTime: 30_000,
  });
}

export function useProposal(id: string | null) {
  return useQuery({
    queryKey: ['proposal', id],
    queryFn: () => api.get(`/governance/${id}`),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useMyVote(proposalId: string | null) {
  return useQuery<'yes' | 'no' | null>({
    queryKey: ['governance-vote', proposalId],
    queryFn: () => api.get(`/governance/${proposalId}/my-vote`),
    enabled: !!proposalId,
    staleTime: Infinity,
  });
}

export function useVoteProposal() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ proposalId, vote }: { proposalId: string; vote: 'yes' | 'no' }) =>
      api.post(`/governance/${proposalId}/vote`, { vote }),
    onSuccess: (_, { proposalId }) => {
      qc.invalidateQueries({ queryKey: ['proposal', proposalId] });
      qc.invalidateQueries({ queryKey: ['governance-vote', proposalId] });
      qc.invalidateQueries({ queryKey: ['proposals'] });
      toast({ type: 'success', title: 'Vote recorded!' });
    },
    onError: (err: Error) => {
      toast({ type: 'error', title: 'Vote failed', description: err.message });
    },
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      category?: string;
      durationDays?: number;
    }) => api.post('/governance', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposals'] });
      toast({ type: 'success', title: 'Proposal submitted!' });
    },
    onError: (err: Error) => {
      toast({ type: 'error', title: 'Failed to create proposal', description: err.message });
    },
  });
}
