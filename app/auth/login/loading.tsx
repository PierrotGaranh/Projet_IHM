import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      <div className="card-base p-8 space-y-6">
        <div className="p-3 rounded-lg space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </form>
        <div className="flex items-center gap-3">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
      <Skeleton className="h-3 w-64 mx-auto" />
    </div>
  );
}