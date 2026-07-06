'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/lib/types/social';

export function useNotifications(address: string | null) {
  return useQuery<Notification[]>({
    queryKey: ['notifications', address],
    queryFn: async () => [],
    enabled: !!address,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useUnreadCount(address: string | null) {
  const { data } = useNotifications(address);
  return (data ?? []).filter(n => !n.read).length;
}

export function useMarkAllRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (_address: string) => {
      await new Promise(r => setTimeout(r, 200));
    },
    onSuccess: (_, address) => {
      qc.setQueryData<Notification[]>(['notifications', address], old =>
        (old ?? []).map(n => ({ ...n, read: true }))
      );
    },
  });
}
