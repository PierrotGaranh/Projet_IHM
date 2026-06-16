'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { Card } from '@/components/atoms/Card';
import { AnalyticsStatsGrid } from '@/components/organisms/AnalyticsStatsGrid';
import { PeakHoursChart } from '@/components/organisms/PeakHoursChart';
import { OccupancyTrend } from '@/components/organisms/OccupancyTrend';
import { RevenueByTypeChart } from '@/components/organisms/RevenueByTypeChart';
import { DistributionStats } from '@/components/organisms/DistributionStats';
import { useIsMobile } from '@/hooks/use-mobile';
import Loading from './loading';

function AnalyticsPageContent() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueByType, setRevenueByType] = useState<Record<string, number>>({});
  const [occupancyByDay, setOccupancyByDay] = useState<number[]>([]);
  const [peakHours, setPeakHours] = useState<{ time: string; count: number }[]>([]);

  useEffect(() => {
    let isMounted = true;
    const store = getStore();
    setStats({ ...store.getDashboardStats(), ...store.getParkingStats() });
    setRevenueByType(store.getRevenueBySpaceType());
    setOccupancyByDay(store.getOccupancyByDayOfWeek());
    setPeakHours(store.getPeakHours());
    if (isMounted) setLoading(false);
    return () => { isMounted = false; };
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1 sm:space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>Analytics</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>Statistiques et tendances détaillées de votre parking</p>
      </div>
      <AnalyticsStatsGrid totalRevenue={stats.totalRevenue} occupancyRate={stats.occupancyRate} activeReservations={stats.activeReservations} totalUsers={stats.totalUsers} revenueChange={stats.revenueChange} newUsersThisMonth={stats.newUsersThisMonth} />
      <Card className="p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Heures de pointe</h2>
        <PeakHoursChart data={peakHours} />
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tendance d'occupation</h2>
          <OccupancyTrend data={occupancyByDay} labels={['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']} />
        </Card>
        <Card className="p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Revenu par type de place</h2>
          <RevenueByTypeChart data={revenueByType} />
        </Card>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution des places</h2>
        <DistributionStats available={stats.availableSpaces} occupied={stats.occupiedSpaces} maintenance={stats.maintenanceSpaces} />
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return <Suspense fallback={<Loading />}><AnalyticsPageContent /></Suspense>;
}