import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="card-base p-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-4">
            <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-full" /></div>
          </div>
        </div>
        <div className="pt-6 border-t border-border space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
          </div>
          <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-full" /></div>
        </div>
        <div className="pt-6 border-t border-border space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between py-3 border-b border-border"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-20" /></div>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-border">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="card-base p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
          ))}
        </div>
      </div>

      <div className="card-base p-6 space-y-4 border-l-4 border-l-destructive">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}