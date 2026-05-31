'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { ActivityLog } from '@/lib/types';
import { DashboardStatsGrid } from '@/components/organisms/DashboardStatsGrid';
import { RecentActivities } from '@/components/molecules/RecentActivities';
import { AdminQuickActionCard } from '@/components/molecules/AdminQuickActionCard';
import { Car, Users, Settings } from 'lucide-react';
import Loading from './loading';

function AdminDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  useEffect(() => { const store = getStore(); setStats(store.getDashboardStats()); setActivities(store.getActivities()); setLoading(false); }, []);
  if (loading) return <Loading />;
  return (
    <div className="space-y-8">
      <div className="space-y-2"><h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1><p className="text-muted-foreground">Vue d'ensemble et statistiques de votre parking</p></div>
      <DashboardStatsGrid activeReservations={stats.activeReservations} availableSpaces={getStore().getParkingStats().availableSpaces} occupancyRate={stats.occupancyRate} totalRevenue={stats.totalRevenue} />
      <RecentActivities activities={activities} limit={6} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminQuickActionCard href="/admin/parking" icon={<Car className="w-6 h-6 text-primary" />} title="Gestion du parking" description="Gérer les places et statuts"/>
        <AdminQuickActionCard href="/admin/users" icon={<Users className="w-6 h-6 text-secondary" />} title="Utilisateurs" description={`${stats.totalUsers} utilisateurs actifs`} />
        <AdminQuickActionCard href="/admin/settings" icon={<Settings className="w-6 h-6 text-accent" />} title="Paramètres" description="Configuration du système" />
      </div>
    </div>
  );
}
export default function AdminDashboard() { return <Suspense fallback={<Loading />}><AdminDashboardContent /></Suspense>; }