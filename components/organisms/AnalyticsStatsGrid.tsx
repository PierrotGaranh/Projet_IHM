import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';

interface AnalyticsStatCardProps {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  footnote?: ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
}

interface AnalyticsStatsGridProps {
  totalRevenue: number;
  occupancyRate: number;
  activeReservations: number;
  totalUsers: number;
  revenueChange: number;
  newUsersThisMonth: number;
}

function AnalyticsStatCard({ label, value, subValue, footnote, color = 'primary' }: AnalyticsStatCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };
  return (
    <Card className="p-6 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
      {subValue && <p className="text-xs text-secondary">{subValue}</p>}
      {footnote && <p className="text-xs text-muted-foreground">{footnote}</p>}
    </Card>
  );
}

export function AnalyticsStatsGrid({ totalRevenue, occupancyRate, activeReservations, totalUsers, revenueChange, newUsersThisMonth }: AnalyticsStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsStatCard
        label="Revenu total"
        value={`${totalRevenue.toFixed(0)}€`}
        subValue={`${revenueChange > 0 ? `+${revenueChange.toFixed(1)}%` : `${revenueChange.toFixed(1)}%`} ce mois`}
        footnote="Basé sur les réservations actives et complétées"
        color="primary"
      />
      <AnalyticsStatCard
        label="Taux d'occupation"
        value={`${Math.round(occupancyRate)}%`}
        subValue="Places occupées + réservées"
        footnote="Optimal entre 80-90%"
        color="accent"
      />
      <AnalyticsStatCard
        label="Réservations actives"
        value={activeReservations}
        footnote="En cours de validité"
        color="secondary"
      />
      <AnalyticsStatCard
        label="Utilisateurs"
        value={totalUsers}
        subValue={`${newUsersThisMonth} nouveaux ce mois`}
        footnote="Comptes actifs enregistrés"
        color="primary"
      />
    </div>
  );
}