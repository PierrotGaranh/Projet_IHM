'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';
import { Car, Check, Calendar, CheckLine, Lightbulb } from 'lucide-react';
import { HomeStatsGrid } from '@/components/organisms/HomeStatsGrid';
import { QuickActionCard } from '@/components/molecules/QuickActionCard';
import { InfoCard } from '@/components/molecules/InfoCard';
import Loading from './loading';

function HomeContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeReservations: 0,
    availableSpaces: 0,
    nextReservation: null as Reservation | null,
  });

  useEffect(() => {
    const store = getStore();
    const reservations = store.getUserReservations(user?.id || '');
    const activeRes = reservations.filter(r => r.status === 'active');
    const nextRes = activeRes.length > 0 ? activeRes.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0] : null;
    const parkingStats = store.getParkingStats();
    setStats({
      activeReservations: activeRes.length,
      availableSpaces: parkingStats.availableSpaces,
      nextReservation: nextRes,
    });
    setLoading(false);
  }, [user?.id]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Bienvenue, {user?.firstName}!</h1>
        <p className="text-muted-foreground">Gérez vos réservations de parking en toute simplicité</p>
      </div>
      <HomeStatsGrid
        stats={{
          activeReservations: stats.activeReservations,
          availableSpaces: stats.availableSpaces,
          nextReservationDate: stats.nextReservation ? new Date(stats.nextReservation.startDate).toLocaleDateString('fr-FR') : 'Aucune',
          nextReservationPlace: stats.nextReservation ? `Place ${getStore().getSpace(stats.nextReservation.spaceId)?.number}` : 'Pas de réservation en cours',
        }}
        icons={{
          car: <Car className="w-5 h-5" />,
          check: <Check className="w-5 h-5" />,
          calendar: <Calendar className="w-5 h-5" />,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard href="/booking" icon={<span className="text-2xl">P</span>} title="Réserver une place" description="Trouvez et réservez votre place de parking" invite="Réserver maintenant"/>
        <QuickActionCard href="/reservations" icon={<CheckLine className="w-5 h-5 text-secondary" />} iconColor='bg-secondary/10 group-hover:bg-secondary/20' title="Mes réservations" description="Consultez l'historique de vos réservations" invite="Voir l'historique"/>
      </div>
      <InfoCard title="Conseil" icon={<Lightbulb className="w-5 h-5" />}>
        Les réservations doivent être effectuées au moins 30 minutes avant utilisation. Vous pouvez annuler ou prolonger vos réservations à tout moment.
      </InfoCard>
    </div>
  );
}
export default function Home() { return <Suspense fallback={<Loading />}><HomeContent /></Suspense>; }