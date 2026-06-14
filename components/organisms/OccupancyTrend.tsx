import { useIsMobile } from '@/hooks/use-mobile';

interface OccupancyTrendProps {
  data: number[];
  labels: string[];
}

export function OccupancyTrend({ data, labels }: OccupancyTrendProps) {
  const isMobile = useIsMobile(600);
  return (
    <div className="space-y-4">
      {labels.map((label, idx) => (
        <div key={label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">{label}</span>
            <span className="font-semibold text-foreground">{data[idx]}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all" style={{ width: `${data[idx]}%` }} />
          </div>
        </div>
      ))}
      {!isMobile && (<p className="text-xs text-muted-foreground">Basé sur les réservations actives</p>)}
    </div>
  );
}