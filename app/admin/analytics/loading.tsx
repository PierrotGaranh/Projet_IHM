import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="card-base p-6 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          {Array(7).fill(0).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-8" /></div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
        <div className="card-base p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-12" /></div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="card-base p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="card-base p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-8" /></div>
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}