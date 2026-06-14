import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HomeStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
  iconBg?: string;
  iconColor?: string;
}

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

function HomeStatCard({ title, value, icon, description, iconBg = 'bg-primary/10', iconColor = 'text-primary' }: HomeStatCardProps) {
  const isMobile = useIsMobile();
  return (
    <Card className={`${isMobile ? 'p-5' : 'p-6'} space-y-3 sm:space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  );
}

export function HomeStatsGrid({ stats, icons }: HomeStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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