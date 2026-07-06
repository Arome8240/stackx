'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Cast } from '@/lib/types/social';

export function useOptimisticLike(cast: Cast) {
  const qc = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = React.useState(cast.isLiked ?? false);
  const [optimisticCount, setOptimisticCount] = React.useState(cast.likesCount ?? 0);

  const likeMutation = useMutation({
    mutationFn: () => api.post(`/casts/${cast.id}/like`, {}),
    onMutate: () => {
      setOptimisticLiked(true);
      setOptimisticCount((n) => n + 1);
    },
    onError: () => {
      setOptimisticLiked(false);
      setOptimisticCount((n) => n - 1);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['cast', cast.id] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => api.delete(`/casts/${cast.id}/like`),
    onMutate: () => {
      setOptimisticLiked(false);
      setOptimisticCount((n) => Math.max(0, n - 1));
    },
    onError: () => {
      setOptimisticLiked(true);
      setOptimisticCount((n) => n + 1);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['cast', cast.id] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  function toggle() {
    if (optimisticLiked) unlikeMutation.mutate();
    else likeMutation.mutate();
  }

  return {
    liked: optimisticLiked,
    likesCount: optimisticCount,
    toggle,
    isPending: likeMutation.isPending || unlikeMutation.isPending,
  };
}
