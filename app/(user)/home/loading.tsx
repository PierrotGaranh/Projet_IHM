import { Skeleton } from '@/components/atoms/Skeleton';
import { Card } from '@/components/atoms/Card';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-40" />
            </Card>
          ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-8 space-y-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
      <Card className="p-6 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-5 h-5 mt-1" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}