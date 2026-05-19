'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const store = getStore();
    const userRes = store.getUserReservations(user?.id || '');
    setReservations(userRes);
  }, [user?.id, refreshKey]);

  const filteredReservations = reservations.filter(r => 
    filter === 'all' ? true : r.status === filter
  );

  const handleCancel = (reservationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      const store = getStore();
      store.cancelReservation(reservationId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      active: { label: 'Active', color: 'bg-secondary/10 text-secondary' },
      completed: { label: 'Complétée', color: 'bg-primary/10 text-primary' },
      cancelled: { label: 'Annulée', color: 'bg-destructive/10 text-destructive' },
    };
    const config = statusConfig[status] || { label: status, color: 'bg-muted text-muted-foreground' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Mes réservations</h1>
        <p className="text-muted-foreground">
          Gérez et consultez l'historique de vos réservations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {filterOption === 'all' ? 'Toutes' : 
             filterOption === 'active' ? 'Actives' :
             filterOption === 'completed' ? 'Complétées' : 'Annulées'}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="card-base p-12 text-center space-y-4">
          <p className="text-2xl">📭</p>
          <p className="text-lg font-semibold text-foreground">Aucune réservation</p>
          <p className="text-muted-foreground">
            {filter === 'all'
              ? 'Vous n\'avez pas encore de réservation. Commencez par en créer une!'
              : `Vous n\'avez pas de réservation ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((reservation) => {
            const store = getStore();
            const space = store.getSpace(reservation.spaceId);
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);

            return (
              <div key={reservation.id} className="card-base p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        Place {space?.number || 'N/A'} - Niveau {space?.level || 'N/A'}
                      </h3>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Réservation ID: {reservation.id}
                    </p>
                  </div>
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="btn-secondary text-sm"
                    >
                      Annuler
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Début</p>
                    <p className="font-semibold text-foreground">
                      {startDate.toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Fin</p>
                    <p className="font-semibold text-foreground">
                      {endDate.toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-semibold text-foreground capitalize">
                      {space?.type || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Montant</p>
                    <p className="font-semibold text-foreground">
                      {reservation.amount.toFixed(2)} €
                    </p>
                  </div>
                </div>

                {space?.features && space.features.length > 0 && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Équipements</p>
                    <div className="flex flex-wrap gap-2">
                      {space.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
