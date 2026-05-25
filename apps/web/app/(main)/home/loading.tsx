import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 px-4 py-3 border-b border-border/40">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="p-4 border-b border-border/40">
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="flex justify-between">
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-8 h-8 rounded-lg" />)}
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border/20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-6">
              {Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-4 w-10" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
