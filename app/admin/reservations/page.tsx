'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';
import { Mailbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ReservationCard } from '@/components/molecules/ReservationCard';
import { EditReservationForm } from '@/components/organisms/EditReservationForm';
import { FiltersBar } from '@/components/organisms/FiltersBar';
import { Pagination } from '@/components/molecules/Pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import Loading from './loading';

function AdminReservationsPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
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
    const allReservations = store.getReservations();
    allReservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReservations(allReservations); 
    setAllUsers(store.getAllUsers()); 
    setLoading(false); 
  };

  useEffect(() => { fetchData(); }, [refreshKey]);
  useEffect(() => { setCurrentPage(1); }, [filter, searchTerm]);
  useEffect(() => { if (listRef.current) smoothScrollToElement(listRef.current); }, [currentPage]);

  const handleCancel = (id: string) => { 
    setCancellingId(id); const store = getStore();
    store.cancelReservation(id); setRefreshKey(prev => prev + 1); 
    setCancellingId(null); 
    toast({ variant: 'success', title: 'Réservation annulée', description: 'La réservation a été annulée avec succès.' }); 
  };
  
  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: { startDate: Date; endDate: Date; vehiclePlate: string; amount: number }) => {
    try {
      if (!editingReservation) return;
      const store = getStore();
      const result = store.updateReservation(
        editingReservation.id,
        data.startDate,
        data.endDate,
        data.vehiclePlate,
        data.amount
      );
      if (!result.success) {
        throw new Error(result.error || 'Une erreur est survenue lors de la modification de la réservation');
      }
      const u = allUsers.find(u => u.id === editingReservation.userId);
      if (u && !u.vehiclePlates.includes(data.vehiclePlate)) {
        store.addVehiclePlate(editingReservation.userId, data.vehiclePlate);
      }
      toast({ variant: 'success', title: 'Réservation modifiée', description: 'La réservation a été mise à jour.' });
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Oops',
        description: 'Une erreur est survenue lors de la modificationde la réservation. Veuillez réessayer.',
      });
    } finally {
      setRefreshKey(prev => prev + 1);
      setShowEditModal(false);
      setEditingReservation(null);
    }
  };
  
  const filtered = reservations.filter(r => filter === 'all' ? true : r.status === filter).filter(r => {
    if (!searchTerm) return true;
    const store = getStore();
    const space = store.getSpace(r.spaceId);
    const user = store.getUser(r.userId);
    return user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || user?.email.toLowerCase().includes(searchTerm.toLowerCase()) || r.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) || space?.number.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIdx, startIdx + itemsPerPage);
  const goToPage = (p: number) => { if (p >= 1 && p <= totalPages) setCurrentPage(p); };

    if (loading) return <Loading />;

  const store = getStore();
  const filterOptions = [
    { value: 'all', label: `Toutes (${reservations.length})` },
    { value: 'active', label: `Actives (${reservations.filter(r => r.status === 'active').length})` },
    { value: 'completed', label: `Complétées (${reservations.filter(r => r.status === 'completed').length})` },
    { value: 'cancelled', label: `Annulées (${reservations.filter(r => r.status === 'cancelled').length})` }
  ];

  const editingUser = editingReservation ? allUsers.find(u => u.id === editingReservation.userId) : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1 sm:space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>Gestion des réservations</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>Visualisez et gérez toutes les réservations du système</p>
      </div>
      <Card className="p-4 sm:p-6 space-y-4">
        <FiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Nom, plaque ou numéro de place..."
          filterLabel="Statut"
          filterOptions={filterOptions}
          filterValue={filter}
          onFilterChange={(v) => setFilter(v as any)}
          addButtonLabel="+ Ajouter une réservation"
          onAddClick={() => router.push('/admin/parking?msg=new_reservation')}
        />
      </Card>
      {filtered.length === 0 ? (
        <Card className="p-6 flex flex-col items-center gap-4 text-center">
          <Mailbox className="w-12 h-12" />
          <p className="text-lg font-semibold text-foreground">Aucune réservation</p>
          <Button variant="primary" onClick={() => router.push('/admin/parking?msg=new_reservation')}>Ajouter une réservation</Button>
        </Card>
      ) : (
        <>
          <div ref={listRef} className="grid gap-4">
            {displayed.map(res => {
              const space = store.getSpace(res.spaceId);
              const user = store.getUser(res.userId);
              const isOngoing = res.status === 'active' && new Date(res.startDate) <= new Date() && new Date(res.endDate) >= new Date();
              const actions = (res.status === 'active' && !isOngoing) ? (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(res)}>Modifier</Button>
                  <Button variant="secondary" onClick={() => { setReservationToCancel(res); setShowCancelModal(true); }} disabled={cancellingId === res.id} isLoading={cancellingId === res.id} loadingText="Annulation">Annuler</Button>
                </div>
              ) : null;
              return <ReservationCard key={res.id} reservation={res} space={space} actions={actions} />;
            })}
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
        </>
      )}

      <ConfirmationModal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)} 
        onConfirm={() => { 
        if (reservationToCancel) handleCancel(reservationToCancel.id); setShowCancelModal(false); }} 
        title="Annuler la réservation" 
        message="Êtes-vous sûr de vouloir procéder à l'annulation de cette réservation ?"
        isDangerous={true}
      >
        {reservationToCancel && (() => { 
            const s = store.getSpace(reservationToCancel.spaceId); 
            return (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div><span className="font-semibold">Utilisateur :</span> {store.getUser(reservationToCancel.userId)?.firstName} {store.getUser(reservationToCancel.userId)?.lastName}</div>
                <div><span className="font-semibold">Place :</span> {s?.number || 'N/A'}</div>
                <div><span className="font-semibold">Début :</span> {new Date(reservationToCancel.startDate).toLocaleString('fr-FR')}</div>
                <div><span className="font-semibold">Fin :</span> {new Date(reservationToCancel.endDate).toLocaleString('fr-FR')}</div>
              </div>); 
            })()}
      </ConfirmationModal>

      {showEditModal && editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Modifier la réservation</h2>
            <EditReservationForm
              reservation={editingReservation}
              pricePerHour={store.getSpace(editingReservation.spaceId)?.pricePerHour || 0}
              userPlates={allUsers.find(u => u.id === editingReservation.userId)?.vehiclePlates || []}
              userName={editingUser ? `${editingUser.firstName} ${editingUser.lastName}` : undefined}
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminReservationsPage() { return <Suspense fallback={<Loading />}><AdminReservationsPageContent /></Suspense>; }