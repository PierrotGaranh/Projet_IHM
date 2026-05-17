'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeReservations: 0,
    availableSpaces: 0,
    nextReservation: null as Reservation | null,
  });

  useEffect(() => {
    const store = getStore();
    const reservations = store.getUserReservations(user?.id || '');
    const activeRes = reservations.filter(r => r.status === 'active');
    const parkingStats = store.getParkingStats();

    setStats({
      activeReservations: activeRes.length,
      availableSpaces: parkingStats.availableSpaces,
      nextReservation: activeRes.length > 0 ? activeRes[0] : null,
    });
  }, [user?.id]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Gérez vos réservations de parking en toute simplicité
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Reservations */}
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Réservations actives</h3>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">🚗</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.activeReservations}</p>
          <p className="text-xs text-muted-foreground">Gérées à partir de votre compte</p>
        </div>

        {/* Available Spaces */}
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Places disponibles</h3>
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-secondary">✓</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.availableSpaces}</p>
          <p className="text-xs text-muted-foreground">Prêtes à être réservées</p>
        </div>

        {/* Next Reservation */}
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Prochaine réservation</h3>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-lg font-bold text-accent">📅</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {stats.nextReservation 
              ? new Date(stats.nextReservation.startDate).toLocaleDateString('fr-FR')
              : 'Aucune'}
          </p>
          <p className="text-xs text-muted-foreground">
            {stats.nextReservation 
              ? 'Réservation programmée'
              : 'Pas de réservation en cours'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking CTA */}
        <Link
          href="/dashboard/booking"
          className="card-base p-8 hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <span className="text-2xl">🅿️</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Réserver une place</h2>
              <p className="text-sm text-muted-foreground">
                Trouvez et réservez votre place de parking
              </p>
            </div>
            <div className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex">
              Réserver maintenant →
            </div>
          </div>
        </Link>

        {/* Reservations List */}
        <Link
          href="/dashboard/reservations"
          className="card-base p-8 hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Mes réservations</h2>
              <p className="text-sm text-muted-foreground">
                Consultez l&apos;historique de vos réservations
              </p>
            </div>
            <div className="text-sm font-semibold text-secondary group-hover:translate-x-1 transition-transform inline-flex">
              Voir l&apos;historique →
            </div>
          </div>
        </Link>
      </div>

      {/* Info Box */}
      <div className="card-base p-6 border-l-4 border-l-accent bg-accent/5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-1">💡</span>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Conseil</h3>
            <p className="text-sm text-muted-foreground">
              Les réservations doivent être effectuées au moins 30 minutes avant utilisation. 
              Vous pouvez annuler ou prolonger vos réservations à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
