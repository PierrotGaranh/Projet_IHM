import { Card } from '@/components/atoms/Card';

interface ParkingStatsProps {
  totalSpaces: number;
  availableSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
}

export function ParkingStats({ totalSpaces, availableSpaces, occupiedSpaces, reservedSpaces }: ParkingStatsProps) {
  return (
    <Card className="p-6 space-y-3">
      <h3 className="font-semibold text-foreground">Statistiques</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total places</span>
          <span className="font-semibold">{totalSpaces}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Disponibles</span>
          <span className="font-semibold text-secondary">{availableSpaces}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Occupées</span>
          <span className="font-semibold text-destructive">{occupiedSpaces}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Réservées</span>
          <span className="font-semibold text-primary">{reservedSpaces}</span>
        </div>
      </div>
    </Card>
  );
}