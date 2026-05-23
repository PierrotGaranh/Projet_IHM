import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((level) => (
            <div key={level} className="card-base p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {Array(15).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card-base p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <div className="space-y-2">
              <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-12" /></div>
              <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-12" /></div>
            </div>
            <div className="pt-3 border-t border-border space-y-2">
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>

          <div className="card-base p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}