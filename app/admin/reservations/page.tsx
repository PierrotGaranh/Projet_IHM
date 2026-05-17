'use client';

import { useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const store = getStore();
    const allRes = store.getReservations();
    setReservations(allRes);
  }, [refreshKey]);

  const handleCancel = (reservationId: string) => {
    if (window.confirm('Annuler cette réservation?')) {
      const store = getStore();
      store.cancelReservation(reservationId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const filteredReservations = reservations.filter(r =>
    filter === 'all' ? true : r.status === filter
  );

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
        <h1 className="text-3xl font-bold text-foreground">Gestion des réservations</h1>
        <p className="text-muted-foreground">
          Visualisez et gérez toutes les réservations du système
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
            {filterOption === 'all' ? `Toutes (${reservations.length})` : 
             filterOption === 'active' ? `Actives (${reservations.filter(r => r.status === 'active').length})` :
             filterOption === 'completed' ? `Complétées (${reservations.filter(r => r.status === 'completed').length})` : 
             `Annulées (${reservations.filter(r => r.status === 'cancelled').length})`}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="card-base p-12 text-center space-y-4">
          <p className="text-2xl">📭</p>
          <p className="text-lg font-semibold text-foreground">Aucune réservation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const store = getStore();
            const space = store.getSpace(reservation.spaceId);
            const user = store.getUser(reservation.userId);
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);

            return (
              <div key={reservation.id} className="card-base p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        Réservation #{reservation.id.slice(-8)}
                      </h3>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user?.firstName} {user?.lastName} • {user?.email}
                    </p>
                  </div>
                  {reservation.status === 'active' && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="btn-secondary text-sm w-full sm:w-auto"
                    >
                      Annuler
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Place</p>
                    <p className="font-semibold text-foreground">
                      {space?.number || 'N/A'} (N{space?.level || 'A'})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Début</p>
                    <p className="font-semibold text-foreground">
                      {startDate.toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Fin</p>
                    <p className="font-semibold text-foreground">
                      {endDate.toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-semibold text-foreground capitalize">
                      {space?.type || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Montant</p>
                    <p className="font-semibold text-foreground text-lg">
                      {reservation.amount.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total réservations</p>
          <p className="text-3xl font-bold text-primary">{reservations.length}</p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Actives</p>
          <p className="text-3xl font-bold text-secondary">
            {reservations.filter(r => r.status === 'active').length}
          </p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Revenu total</p>
          <p className="text-3xl font-bold text-accent">
            {reservations.reduce((sum, r) => sum + r.amount, 0).toFixed(0)}€
          </p>
        </div>
        <div className="card-base p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Revenu actif</p>
          <p className="text-3xl font-bold text-primary">
            {reservations.filter(r => r.status === 'active').reduce((sum, r) => sum + r.amount, 0).toFixed(0)}€
          </p>
        </div>
      </div>
    </div>
  );
}
