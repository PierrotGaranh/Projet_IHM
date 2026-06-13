import { Skeleton } from '@/components/atoms/Skeleton';
import { Card } from '@/components/atoms/Card';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80" />
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
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}