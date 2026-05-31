import { DistributionStatItem } from '@/components/molecules/DistributionStatItem';

interface DistributionStatsProps {
  available: number;
  occupied: number;
  reserved: number;
  maintenance: number;
}

export function DistributionStats({ available, occupied, reserved, maintenance }: DistributionStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DistributionStatItem color="secondary" label="Disponibles" value={available} />
      <DistributionStatItem color="destructive" label="Occupées" value={occupied} />
      <DistributionStatItem color="primary" label="Réservées" value={reserved} />
      <DistributionStatItem color="muted" label="Maintenance" value={maintenance} />
    </div>
  );
}