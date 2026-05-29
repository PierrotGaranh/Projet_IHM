'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import Loading from './loading';

function AnalyticsPageContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [revenueByType, setRevenueByType] = useState<Record<string, number>>({});
  const [occupancyByDay, setOccupancyByDay] = useState<number[]>([]);
  const [peakHours, setPeakHours] = useState<{ time: string; count: number }[]>([]);

  useEffect(() => {
    const store = getStore();
    setStats({ ...store.getDashboardStats(), ...store.getParkingStats() });
    setRevenueByType(store.getRevenueBySpaceType());
    setOccupancyByDay(store.getOccupancyByDayOfWeek());
    setPeakHours(store.getPeakHours());
    setLoading(false);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Statistiques et tendances détaillées de votre parking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Revenu total</p>
          <p className="text-3xl font-bold text-primary">{stats.totalRevenue.toFixed(0)}€</p>
          <p className="text-xs text-secondary">{stats.revenueChange > 0 ? `+${stats.revenueChange.toFixed(1)}%` : `${stats.revenueChange.toFixed(1)}%`} ce mois</p>
          <p className="text-xs text-muted-foreground">Basé sur les réservations actives et complétées</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Taux d'occupation</p>
          <p className="text-3xl font-bold text-accent">{Math.round(stats.occupancyRate)}%</p>
          <p className="text-xs text-secondary">Places occupées + réservées</p>
          <p className="text-xs text-muted-foreground">Optimal entre 80-90%</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Réservations actives</p>
          <p className="text-3xl font-bold text-secondary">{stats.activeReservations}</p>
          <p className="text-xs text-muted-foreground">Sur {stats.totalReservations} totales</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Utilisateurs</p>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
          <p className="text-xs text-secondary">{stats.newUsersThisMonth} nouveaux ce mois</p>
          <p className="text-xs text-muted-foreground">Comptes actifs enregistrés</p>
        </div>
      </div>

      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Heures de pointe</h2>
        
        {peakHours.some(h => h.count > 0) ? (
          <>
            <div className="flex items-end gap-2 pt-4 overflow-x-auto pb-2">
              {peakHours
                .filter(item => item.count > 0)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((item) => {
                  const maxCount = Math.max(...peakHours.map(h => h.count));
                  const heightPercent = maxCount === 0 ? 0 : (item.count / maxCount) * 100;
                  const barHeight = Math.max(24, (heightPercent / 100) * 200);
                  return (
                    <div key={item.time} className="flex flex-col items-center flex-shrink-0 w-14">
                      <div className="relative w-full flex flex-col items-center">
                        <div
                          className="w-1 bg-accent rounded-full transition-all duration-300 hover:bg-accent/80"
                          style={{ height: `${barHeight}px` }}
                        />
                        <span className="text-xs font-semibold text-foreground mt-2">
                          {item.count}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-muted-foreground">
              Nombre de réservations débutant à chaque heure (hauteur proportionnelle au max)
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune réservation enregistrée
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tendance d'occupation</h2>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
              <div key={day} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{day}</span>
                  <span className="font-semibold text-foreground">{occupancyByDay[idx]}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all" style={{ width: `${occupancyByDay[idx]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Basé sur les réservations actives</p>
        </div>

        <div className="card-base p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Revenu par type de place</h2>
          <div className="space-y-3">
            {Object.entries(revenueByType).map(([type, amount]) => (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{type}</span>
                  <span className="font-semibold text-foreground">{amount.toFixed(0)}€</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-secondary transition-all" style={{ width: `${(amount / Math.max(...Object.values(revenueByType))) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Montant généré par les réservations (hors annulations)</p>
        </div>
      </div>

      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution des places</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary" /><p className="text-sm text-muted-foreground">Disponibles</p></div>
            <p className="text-2xl font-bold text-secondary">{stats.availableSpaces}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-destructive" /><p className="text-sm text-muted-foreground">Occupées</p></div>
            <p className="text-2xl font-bold text-destructive">{stats.occupiedSpaces}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><p className="text-sm text-muted-foreground">Réservées</p></div>
            <p className="text-2xl font-bold text-primary">{stats.reservedSpaces}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted" /><p className="text-sm text-muted-foreground">Maintenance</p></div>
            <p className="text-2xl font-bold text-muted-foreground">{stats.maintenanceSpaces}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {return <Suspense fallback={<Loading />}><AnalyticsPageContent /></Suspense>};