import { Skeleton } from '@/components/atoms/Skeleton';
import { Card } from '@/components/atoms/Card';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex items-end">
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
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
          </Card>
        ))}
      </div>
    </div>
  );
}