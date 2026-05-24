import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted animate-shimmer bg-[length:200%_100%]',
        'bg-gradient-to-r from-muted via-muted-foreground/10 to-muted',
        className,
      )}
    />
  );
}

export function CastCardSkeleton() {
  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <div className="flex gap-8 pt-1">
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="px-4 space-y-3">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-4 w-64 rounded-full" />
        <Skeleton className="h-4 w-48 rounded-full" />
      </div>
    </div>
  );
}

export function SidebarUserSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-24 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>
    </div>
  );
}
