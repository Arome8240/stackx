'use client';

import { CastComposer } from '@/components/cast/cast-composer';
import { CastCard } from '@/components/cast/cast-card';
import { useCasts } from '@/lib/hooks/use-casts';

export default function HomePage() {
  const { casts, loading, error } = useCasts();

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="flex border-b border-border">
          <button className="flex-1 py-4 font-semibold border-b-2 border-primary">
            For You
          </button>
          <button className="flex-1 py-4 text-muted-foreground hover:bg-accent transition-colors">
            Following
          </button>
        </div>
      </div>

      {/* Cast Composer */}
      <CastComposer />

      {/* Feed */}
      <div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading casts from blockchain...</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">Failed to load casts. Check contract configuration.</div>
        ) : casts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No casts found. Be the first to post!</div>
        ) : (
          casts.map((cast) => (
            <CastCard key={cast.id} cast={cast} />
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && casts.length > 0 && (
        <div className="p-8 text-center">
          <button className="text-primary hover:underline">Load more casts</button>
        </div>
      )}
    </div>
  );
}
