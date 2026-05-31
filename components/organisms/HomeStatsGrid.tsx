import { ReactNode } from 'react';
import { HomeStatCard } from '@/components/molecules/HomeStatCard';

interface HomeStatsGridProps {
  stats: {
    activeReservations: number;
    availableSpaces: number;
    nextReservationDate: string;
    nextReservationPlace?: string;
  };
  icons: {
    car: ReactNode;
    check: ReactNode;
    calendar: ReactNode;
  };
}

export function HomeStatsGrid({ stats, icons }: HomeStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <HomeStatCard
        title="Réservations actives"
        value={stats.activeReservations}
        icon={icons.car}
        description="Gérées à partir de votre compte"
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <HomeStatCard
        title="Places disponibles"
        value={stats.availableSpaces}
        icon={icons.check}
        description="Prêtes à être réservées"
        iconBg="bg-secondary/10"
        iconColor="text-secondary"
      />
      <HomeStatCard
        title="Prochaine réservation"
        value={stats.nextReservationDate}
        icon={icons.calendar}
        description={stats.nextReservationPlace || 'Aucune réservation en cours'}
        iconBg="bg-accent/10"
        iconColor="text-accent"
      />
    </div>
  );
}