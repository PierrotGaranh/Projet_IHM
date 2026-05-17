'use client';

import { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const store = getStore();
    const dashStats = store.getDashboardStats();
    const parkingStats = store.getParkingStats();
    setStats({ ...dashStats, ...parkingStats });
  }, []);

  if (!stats) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Statistiques et tendances détaillées de votre parking
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Revenu total</p>
          <p className="text-3xl font-bold text-primary">{stats.totalRevenue.toFixed(0)}€</p>
          <p className="text-xs text-secondary">+12% ce mois</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Taux d&apos;occupation</p>
          <p className="text-3xl font-bold text-accent">{Math.round(stats.occupancyRate)}%</p>
          <p className="text-xs text-secondary">Optimal entre 80-90%</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Réservations actives</p>
          <p className="text-3xl font-bold text-secondary">{stats.activeReservations}</p>
          <p className="text-xs text-muted-foreground">Sur {stats.totalReservations}</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Utilisateurs</p>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
          <p className="text-xs text-secondary">+5 ce mois</p>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupation Trend */}
        <div className="card-base p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tendance d&apos;occupation</h2>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => {
              const percentage = Math.round(Math.random() * 70) + 30;
              return (
                <div key={day} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{day}</span>
                    <span className="font-semibold text-foreground">{percentage}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Type */}
        <div className="card-base p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Revenu par type de place</h2>
          <div className="space-y-3">
            {[
              { type: 'Standard', amount: 450 },
              { type: 'Premium', amount: 320 },
              { type: 'Compact', amount: 180 },
            ].map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{item.type}</span>
                  <span className="font-semibold text-foreground">{item.amount}€</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${(item.amount / 450) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parking Status Distribution */}
      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution des places</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <p className="text-sm text-muted-foreground">Disponibles</p>
            </div>
            <p className="text-2xl font-bold text-secondary">{stats.availableSpaces}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <p className="text-sm text-muted-foreground">Occupées</p>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.occupiedSpaces}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground">Réservées</p>
            </div>
            <p className="text-2xl font-bold text-primary">{stats.reservedSpaces}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">{stats.maintenanceSpaces}</p>
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Heures de pointe</h2>
        <div className="space-y-3">
          {[
            { time: '08:00 - 10:00', occupancy: 85 },
            { time: '12:00 - 14:00', occupancy: 92 },
            { time: '14:00 - 16:00', occupancy: 88 },
            { time: '16:00 - 18:00', occupancy: 78 },
            { time: '18:00 - 20:00', occupancy: 65 },
          ].map((item) => (
            <div key={item.time} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.time}</span>
                <span className="font-semibold text-foreground">{item.occupancy}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${item.occupancy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
