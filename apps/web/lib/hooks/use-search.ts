'use client';

import { useQuery } from '@tanstack/react-query';
import { debounce } from '@/lib/utils';
import * as React from 'react';
import type { User, Cast, Channel } from '@/lib/types/social';

interface SearchResults {
  users:    User[];
  casts:    Cast[];
  channels: Channel[];
}

async function runSearch(query: string): Promise<SearchResults> {
  if (!query.trim()) return { users: [], casts: [], channels: [] };
  await new Promise(r => setTimeout(r, 300));
  return { users: [], casts: [], channels: [] };
}

export function useSearch(rawQuery: string) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(rawQuery);

  const updateDebounced = React.useMemo(
    () => debounce((q: string) => setDebouncedQuery(q), 300),
    [],
  );

  React.useEffect(() => { updateDebounced(rawQuery); }, [rawQuery, updateDebounced]);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => runSearch(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 30_000,
  });
}
