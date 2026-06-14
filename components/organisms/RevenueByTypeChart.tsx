import { useIsMobile } from '@/hooks/use-mobile';

interface RevenueByTypeChartProps {
  data: Record<string, number>;
}

export function RevenueByTypeChart({ data }: RevenueByTypeChartProps) {
  const isMobile = useIsMobile(600);
  const max = Math.max(...Object.values(data));
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([type, amount]) => (
        <div key={type} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground capitalize">{type}</span>
            <span className="font-semibold text-foreground">{amount.toFixed(0)}€</span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-secondary transition-all" style={{ width: `${(amount / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {!isMobile && (<p className="text-xs text-muted-foreground">Montant généré par les réservations (hors annulations)</p>)}
    </div>
  );
}