import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>
      {/* 4 cartes stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="card-base p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          ))}
      </div>
      {/* Activité récente (logs) */}
      <div className="card-base p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <Skeleton className="h-2 w-2 rounded-full mt-2" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
      </div>
      {/* 3 actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="card-base p-6 space-y-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
      </div>
    </div>
  );
}