import { Card } from '@/components/atoms/Card';

interface DistributionStatsProps {
  available: number;
  occupied: number;
  maintenance: number;
}

function DistributionStatItem({ color, label, value }: { color: string; label: string; value: number }) {
  const colorClasses: Record<string, string> = {
    secondary: 'bg-secondary text-secondary',
    destructive: 'bg-destructive text-destructive',
    primary: 'bg-primary text-primary',
    muted: 'bg-muted text-muted-foreground',
  };
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colorClasses[color].split(' ')[0]}`} />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]}`}>{value}</p>
    </Card>
  );
}

export function DistributionStats({ available, occupied, maintenance }: DistributionStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <DistributionStatItem color="secondary" label="Disponibles" value={available} />
      <DistributionStatItem color="destructive" label="Occupées" value={occupied} />
      <DistributionStatItem color="muted" label="Maintenance" value={maintenance} />
    </div>
  );
}