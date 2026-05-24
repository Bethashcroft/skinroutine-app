interface Props {
  className?: string;
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/30 dark:bg-white/6 ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="flex">
        <div className="w-1 shrink-0 bg-gray-300/30 dark:bg-gray-600/20" />
        <div className="flex flex-1 items-center gap-3 px-5 py-4">
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-3xl" />
      <div className="flex gap-3">
        <Skeleton className="h-16 flex-1 rounded-2xl" />
        <Skeleton className="h-16 flex-1 rounded-2xl" />
        <Skeleton className="h-16 flex-1 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
