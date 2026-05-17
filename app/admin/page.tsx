'use client';

import { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';

interface Stats {
  totalReservations: number;
  activeReservations: number;
  occupancyRate: number;
  totalRevenue: number;
  totalUsers: number;
  availableSpaces: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const store = getStore();
    const dashboardStats = store.getDashboardStats();
    setStats(dashboardStats);
  }, []);

  const StatCard = ({ title, value, unit = '', color = 'primary' }: {
    title: string;
    value: string | number;
    unit?: string;
    color?: 'primary' | 'secondary' | 'accent' | 'destructive';
  }) => {
    const bgColors: Record<string, string> = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      accent: 'bg-accent/10 text-accent',
      destructive: 'bg-destructive/10 text-destructive',
    };

    return (
      <div className="card-base p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={`w-10 h-10 rounded-lg ${bgColors[color]} flex items-center justify-center text-lg`}>
            {color === 'primary' ? '📊' : color === 'secondary' ? '✓' : color === 'accent' ? '📅' : '⚠️'}
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground">
          {value}{unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    );
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble et statistiques de votre parking
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Réservations totales"
          value={stats.totalReservations}
          color="primary"
        />
        <StatCard
          title="Réservations actives"
          value={stats.activeReservations}
          color="secondary"
        />
        <StatCard
          title="Places disponibles"
          value={stats.availableSpaces}
          color="accent"
        />
        <StatCard
          title="Taux d&apos;occupation"
          value={Math.round(stats.occupancyRate)}
          unit="%"
          color="primary"
        />
        <StatCard
          title="Revenu total"
          value={stats.totalRevenue.toFixed(0)}
          unit="€"
          color="secondary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <div className="card-base p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Occupation par niveau</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((level) => {
              const percentage = Math.round(Math.random() * 90) + 10;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Niveau {level}</span>
                    <span className="font-semibold text-foreground">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card-base p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Revenu des 7 derniers jours</h2>
          <div className="space-y-3">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
              const revenue = Math.round(Math.random() * 500) + 100;
              const maxRevenue = 600;
              const percentage = (revenue / maxRevenue) * 100;
              return (
                <div key={day} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{day}</span>
                    <span className="font-semibold text-foreground">{revenue}€</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/parking" className="card-base p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="space-y-3">
            <div className="text-2xl">🅿️</div>
            <h3 className="font-semibold text-foreground">Gestion du parking</h3>
            <p className="text-sm text-muted-foreground">Gérer les places et statuts</p>
          </div>
        </a>

        <a href="/admin/users" className="card-base p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="space-y-3">
            <div className="text-2xl">👥</div>
            <h3 className="font-semibold text-foreground">Utilisateurs</h3>
            <p className="text-sm text-muted-foreground">{stats.totalUsers} utilisateurs actifs</p>
          </div>
        </a>

        <a href="/admin/settings" className="card-base p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="space-y-3">
            <div className="text-2xl">⚙️</div>
            <h3 className="font-semibold text-foreground">Paramètres</h3>
            <p className="text-sm text-muted-foreground">Configuration du système</p>
          </div>
        </a>
      </div>

      {/* Recent Activity */}
      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Nouvelle réservation</p>
              <p className="text-xs text-muted-foreground">Il y a 5 minutes</p>
            </div>
            <span className="text-sm text-primary font-semibold">+45€</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Réservation annulée</p>
              <p className="text-xs text-muted-foreground">Il y a 12 minutes</p>
            </div>
            <span className="text-sm text-destructive font-semibold">-30€</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Nouvel utilisateur</p>
              <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
            </div>
            <span className="text-sm text-secondary font-semibold">+1 user</span>
          </div>
        </div>
      </div>
    </div>
  );
}
