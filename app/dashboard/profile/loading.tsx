import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="card-base p-8 space-y-6">
        <div className="flex items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><Skeleton className="h-3 w-32" /><Skeleton className="h-5 w-40" /></div>
              <div className="space-y-1"><Skeleton className="h-3 w-32" /><Skeleton className="h-5 w-40" /></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-border">
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>

      <div className="card-base p-6 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-5 h-5 mt-1" />
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}