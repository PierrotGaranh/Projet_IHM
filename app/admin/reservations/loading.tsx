import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>
      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-28" />
        ))}
      </div>
      {/* Liste des réservations */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-base p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-border">
              {Array(5)
                .fill(0)
                .map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {/* 4 cartes de stats en bas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="card-base p-6 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-40" />
            </div>
          ))}
      </div>
    </div>
  );
}