'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Car, CheckCircle2, Users, Settings, Activity } from 'lucide-react';
import { ActivityLog } from '@/lib/types';
import Loading from './loading';

function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const store = getStore();
    setStats(store.getDashboardStats());
    setActivities(store.getActivities());
  }, []);

  if (!stats) {
    return <div className="space-y-8"><Skeleton className="h-10 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div></div>;
  }

  const StatCard = ({ title, value, unit = '', icon: Icon, color = 'primary', description }: any) => {
    const bgColors: Record<string, string> = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      accent: 'bg-accent/10 text-accent',
      destructive: 'bg-destructive/10 text-destructive',
    };
    return (
      <div className="card-base p-6 space-y-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={`w-10 h-10 rounded-lg ${bgColors[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground">{value}{unit && <span className="text-lg ml-1">{unit}</span>}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-muted-foreground">Vue d'ensemble et statistiques de votre parking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Réservations actives" value={stats.activeReservations} icon={CheckCircle2} color="secondary" description="En cours de validité" />
        <StatCard title="Places disponibles" value={getStore().getParkingStats().availableSpaces} icon={BarChart3} color="accent" description="Libres et non réservées" />
        <StatCard title="Taux d'occupation" value={Math.round(stats.occupancyRate)} unit="%" icon={BarChart3} color="primary" description="Places occupées + réservées" />
        <StatCard title="Revenu total" value={stats.totalRevenue.toFixed(0)} unit="€" icon={CheckCircle2} color="secondary" description="Réservations actives + complétées" />
      </div>

      {/* Section des logs d'activité */}
      <div className="card-base p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
        </div>
        <div className="space-y-3">
          {activities.slice(0, 6).map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{log.message}</p>
                <p className="text-xs text-muted-foreground">{log.timestamp.toLocaleString('fr-FR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/parking" className="card-base p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="space-y-3">
            <Car className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-foreground">Gestion du parking</h3>
            <p className="text-sm text-muted-foreground">Gérer les places et statuts</p>
          </div>
        </a>
        <a href="/admin/users" className="card-base p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="space-y-3">
            <Users className="w-6 h-6 text-secondary" />
            <h3 className="font-semibold text-foreground">Utilisateurs</h3>
            <p className="text-sm text-muted-foreground">{stats.totalUsers} utilisateurs actifs</p>
          </div>
        </a>
        <a href="/admin/settings" className="card-base p-6 hover:shadow-md transition-shadow group cursor-pointer">
          <div className="space-y-3">
            <Settings className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-foreground">Paramètres</h3>
            <p className="text-sm text-muted-foreground">Configuration du système</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function AdminDashboard() {return <Suspense fallback={<Loading />}><AdminDashboardContent /></Suspense>};