import { DashboardStatCard } from '@/components/molecules/DashboardStatCard';
import { BarChart3, CheckCircle2 } from 'lucide-react';

interface DashboardStatsGridProps {
  activeReservations: number;
  availableSpaces: number;
  occupancyRate: number;
  totalRevenue: number;
}

export function DashboardStatsGrid({ activeReservations, availableSpaces, occupancyRate, totalRevenue }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard title="Réservations actives" value={activeReservations} icon={<CheckCircle2 className="w-5 h-5" />} color="secondary" description="En cours de validité" />
      <DashboardStatCard title="Places disponibles" value={availableSpaces} icon={<BarChart3 className="w-5 h-5" />} color="accent" description="Libres et non réservées" />
      <DashboardStatCard title="Taux d'occupation" value={Math.round(occupancyRate)} unit="%" icon={<BarChart3 className="w-5 h-5" />} color="primary" description="Places occupées + réservées" />
      <DashboardStatCard title="Revenu total" value={totalRevenue.toFixed(0)} unit="€" icon={<CheckCircle2 className="w-5 h-5" />} color="secondary" description="Réservations actives + complétées" />
    </div>
  );
}