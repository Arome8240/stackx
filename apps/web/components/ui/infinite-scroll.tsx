'use client';

import * as React from 'react';
import { Spinner } from './spinner';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  loadingText?: string;
  endText?: string;
}

export function InfiniteScroll({
  children,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 300,
  loadingText = 'Loading more…',
  endText = 'You\'ve reached the end',
}: InfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: `${threshold}px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="flex items-center justify-center py-6 text-sm text-muted-foreground">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            {loadingText}
          </div>
        ) : !hasNextPage ? (
          <span>{endText}</span>
        ) : null}
      </div>
    </>
  );
}
