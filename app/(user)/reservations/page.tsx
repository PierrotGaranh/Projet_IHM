'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';
import { Mailbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ReservationCard } from '@/components/molecules/ReservationCard';
import { EditReservationForm } from '@/components/organisms/EditReservationForm';
import { ReservationFilterButtons } from '@/components/molecules/ReservationFilterButtons';
import { Pagination } from '@/components/molecules/Pagination';
import Loading from './loading';

function ReservationsPageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const listRef = useRef<HTMLDivElement>(null);
  const smoothScrollToElement = (el: HTMLElement, offset = 80) => { const pos = el.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: pos - offset, behavior: 'smooth' }); };
  const fetchData = () => { 
    const store = getStore(); 
    setReservations(store.getUserReservations(user?.id || '')); 
    setAllUsers(store.getAllUsers()); 
    setLoading(false); 
  };

  useEffect(() => { fetchData(); }, [user?.id, refreshKey]);
  useEffect(() => { setCurrentPage(1); }, [filter]);
  useEffect(() => { if (listRef.current) smoothScrollToElement(listRef.current); }, [currentPage]);

  const handleCancel = (id: string) => { const store = getStore(); store.cancelReservation(id); setRefreshKey(prev => prev + 1); toast({ variant: 'success', title: 'Réservation annulée', description: 'Votre réservation a été annulée avec succès.' }); };
  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => {
    if (!editingReservation) return;
    const store = getStore();
    store.cancelReservation(editingReservation.id);
    const result = store.createReservation(user!.id, editingReservation.spaceId, data.startDate, data.endDate, data.vehiclePlate);
    if (result.success) {
      const currentUser = allUsers.find(u => u.id === user!.id);
      if (currentUser && !currentUser.vehiclePlates.includes(data.vehiclePlate)) store.addVehiclePlate(user!.id, data.vehiclePlate);
      toast({ variant: 'success', title: 'Réservation modifiée', description: 'Votre réservation a été mise à jour.' });
      setRefreshKey(prev => prev + 1);
      setShowEditModal(false);
      setEditingReservation(null);
    } else {
      throw new Error(result.error || 'Erreur lors de la modification');
    }
  };

  const filtered = reservations.filter(r => filter === 'all' ? true : r.status === filter);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIdx, startIdx + itemsPerPage);
  const goToPage = (p: number) => { if (p >= 1 && p <= totalPages) setCurrentPage(p); };

  if (loading) return <Loading />;

  const store = getStore();
  const userPlates = allUsers.find(u => u.id === user?.id)?.vehiclePlates || [];
  
  return (
    <div className="space-y-8">
      <div className="space-y-2"><h1 className="text-3xl font-bold text-foreground">Mes réservations</h1><p className="text-muted-foreground">Consultez l'historique de vos réservations</p></div>
      <ReservationFilterButtons filter={filter} onFilterChange={setFilter} />
      {filtered.length === 0 ? (
        <Card className="p-6 flex flex-col items-center gap-4 text-center">
          <Mailbox className="w-12 h-12" />
          <p className="text-lg font-semibold text-foreground">Aucune réservation</p>
          <p className="text-muted-foreground">{filter === 'all' ? 'Commencez par en créer une !' : ''}</p>
        </Card>
      ) : (
        <>
          <div ref={listRef} className="grid gap-4">
            {displayed.map(res => {
              const space = store.getSpace(res.spaceId);
              const isOngoing = res.status === 'active' && new Date(res.startDate) <= new Date() && new Date(res.endDate) >= new Date();
              const actions = (res.status === 'active' && !isOngoing) ? (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(res)}>Modifier</Button>
                  <Button variant="secondary" onClick={() => { setReservationToCancel(res); setShowCancelModal(true); }}>Annuler</Button>
                </div>
              ) : null;
              return <ReservationCard key={res.id} reservation={res} space={space} actions={actions} />;
            })}
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
        </>
      )}

      <ConfirmationModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={() => { 
        if (reservationToCancel) handleCancel(reservationToCancel.id); setShowCancelModal(false); 
      }} title="Annuler la réservation" message="Êtes-vous sûr de vouloir annuler cette réservation ?" isDangerous={true}>

      {reservationToCancel && (() => { 
        const s = store.getSpace(reservationToCancel.spaceId); 
        return (
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div><span className="font-semibold">Place :</span> {s?.number || 'N/A'}</div>
            <div><span className="font-semibold">Début :</span> {new Date(reservationToCancel.startDate).toLocaleString('fr-FR')}</div>
            <div><span className="font-semibold">Fin :</span> {new Date(reservationToCancel.endDate).toLocaleString('fr-FR')}</div>
          </div>
        ); })()}

      </ConfirmationModal>
      {showEditModal && editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Modifier la réservation</h2>
            <EditReservationForm
              reservation={editingReservation}
              pricePerHour={store.getSpace(editingReservation.spaceId)?.pricePerHour || 0}
              userPlates={userPlates}
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default function ReservationsPage() { return <Suspense fallback={<Loading />}><ReservationsPageContent /></Suspense>; }