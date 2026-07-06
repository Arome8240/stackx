'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Cast } from '@/lib/types/social';

export function useOptimisticRecast(cast: Cast) {
  const qc = useQueryClient();
  const [optimisticRecasted, setOptimisticRecasted] = React.useState(cast.isRecasted ?? false);
  const [optimisticCount, setOptimisticCount] = React.useState(cast.recastsCount ?? 0);

  const recastMutation = useMutation({
    mutationFn: () => api.post(`/casts/${cast.id}/recast`, {}),
    onMutate: () => {
      setOptimisticRecasted(true);
      setOptimisticCount((n) => n + 1);
    },
    onError: () => {
      setOptimisticRecasted(false);
      setOptimisticCount((n) => Math.max(0, n - 1));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['cast', cast.id] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    recasted: optimisticRecasted,
    recastsCount: optimisticCount,
    recast: () => recastMutation.mutate(),
    isPending: recastMutation.isPending,
  };
}
