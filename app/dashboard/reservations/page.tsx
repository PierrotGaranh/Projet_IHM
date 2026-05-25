'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';
import { Mailbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/confirmation-modal';
import Loading from './loading';

function ReservationsPageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);

  const fetchData = () => {
    const store = getStore();
    const userRes = store.getUserReservations(user?.id || '');
    setReservations(userRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user?.id, refreshKey]);

  const handleCancel = (reservationId: string) => {
    setCancellingId(reservationId);
    const store = getStore();
    store.cancelReservation(reservationId);
    setRefreshKey(prev => prev + 1);
    setCancellingId(null);
    toast({
      variant: 'success',
      title: 'Réservation annulée',
      description: 'Votre réservation a été annulée avec succès.',
    });
  };

  if (loading) return <Loading />;

  const filteredReservations = reservations.filter(r => filter === 'all' ? true : r.status === filter);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      active: { label: 'Active', color: 'bg-secondary/10 text-secondary' },
      completed: { label: 'Complétée', color: 'bg-primary/10 text-primary' },
      cancelled: { label: 'Annulée', color: 'bg-destructive/10 text-destructive' },
    };
    const c = config[status] || { label: status, color: 'bg-muted text-muted-foreground' };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Mes réservations</h1>
        <p className="text-muted-foreground">Gérez et consultez l'historique de vos réservations</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {(['all', 'active', 'completed', 'cancelled'] as const).map(opt => (
          <button key={opt} onClick={() => setFilter(opt)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === opt ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
            {opt === 'all' ? 'Toutes' : opt === 'active' ? 'Actives' : opt === 'completed' ? 'Complétées' : 'Annulées'}
          </button>
        ))}
      </div>

      {filteredReservations.length === 0 ? (
        <div className="card-base p-6 flex flex-col items-center gap-4 text-center">
          <Mailbox className="w-12 h-12" />
          <p className="text-lg font-semibold text-foreground">Aucune réservation</p>
          <p className="text-muted-foreground">{filter === 'all' ? 'Commencez par en créer une !' : ''}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map(res => {
            const store = getStore();
            const space = store.getSpace(res.spaceId);
            const startDate = new Date(res.startDate);
            const endDate = new Date(res.endDate);
            return (
              <div key={res.id} className="card-base p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">Place {space?.number || 'N/A'} - Niveau {space?.level || 'N/A'}</h3>
                      {getStatusBadge(res.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {res.id}</p>
                  </div>
                  {res.status === 'active' && (
                    <button onClick={() => { setReservationToCancel(res.id); setShowCancelModal(true); }} className="btn-secondary text-sm disabled:opacity-50 cursor-pointer">
                      Annuler
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Début</p><p className="font-semibold">{startDate.toLocaleDateString('fr-FR')}</p><p className="text-xs">{startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p></div>
                  <div><p className="text-muted-foreground">Fin</p><p className="font-semibold">{endDate.toLocaleDateString('fr-FR')}</p><p className="text-xs">{endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p></div>
                  <div><p className="text-muted-foreground">Type</p><p className="font-semibold capitalize">{space?.type || 'N/A'}</p></div>
                  <div><p className="text-muted-foreground">Montant</p><p className="font-semibold">{res.amount.toFixed(2)} €</p></div>
                </div>
                {space?.features?.length ? (
                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Équipements</p>
                    <div className="flex flex-wrap gap-2">
                      {space.features.map(f => <span key={f} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{f}</span>)}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          if (reservationToCancel) handleCancel(reservationToCancel);
          setShowCancelModal(false);
        }}
        title="Annuler la réservation"
        message="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
      />
    </div>
  );
}

export default function ReservationsPage() {return <Suspense fallback={<Loading />}><ReservationsPageContent /></Suspense>};