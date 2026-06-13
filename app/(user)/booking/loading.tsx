import { Skeleton } from '@/components/atoms/Skeleton';
import { Card } from '@/components/atoms/Card';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Card className="p-4 space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 min-w-[150px]">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((level) => (
            <Card key={level} className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {Array(18).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
      <Card className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}