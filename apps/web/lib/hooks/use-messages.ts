'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/messages/conversations'),
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useConversation(userId: string | null, page = 1) {
  return useQuery({
    queryKey: ['conversation', userId, page],
    queryFn: () => api.get(`/messages/${userId}?page=${page}&limit=50`),
    enabled: !!userId,
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

export function useDMUnreadCount() {
  return useQuery<number>({
    queryKey: ['dm-unread-count'],
    queryFn: () => api.get<number>('/messages/unread-count'),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ recipientId, body }: { recipientId: string; body: string }) =>
      api.post(`/messages/${recipientId}`, { body }),
    onSuccess: (_, { recipientId }) => {
      qc.invalidateQueries({ queryKey: ['conversation', recipientId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      toast({ type: 'error', title: 'Message failed to send' });
    },
  });
}

export function useMarkConversationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.patch(`/messages/${userId}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dm-unread-count'] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
