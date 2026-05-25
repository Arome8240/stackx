'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface CreateReportDto {
  targetType: 'cast' | 'user' | 'channel';
  targetId: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'explicit' | 'scam' | 'other';
  details?: string;
}

export function useReport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportDto) => api.post('/reports', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
