'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { getStore } from '@/lib/store';
import { Reservation } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import { Mailbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { useRouter } from 'next/navigation';
import { VehiclePlateInput } from '@/components/vehicle-plate-input';
import Loading from './loading';

function AdminReservationsPageContent() {
  const { toast } = useToast();
  const router = useRouter();
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
  const [editStartDate, setEditStartDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editVehiclePlate, setEditVehiclePlate] = useState('');
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [vehiclePlateOptions, setVehiclePlateOptions] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const listRef = useRef<HTMLDivElement>(null);

  const smoothScrollToElement = (element: HTMLElement, offset = 80) => {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
  };

  const fetchData = () => {
    const store = getStore();
    const allRes = store.getReservations();
    setReservations(allRes);
    setAllUsers(store.getAllUsers());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  useEffect(() => {
    if (listRef.current) {
      smoothScrollToElement(listRef.current);
    }
  }, [currentPage]);

  const handleCancel = (reservationId: string) => {
    setCancellingId(reservationId);
    const store = getStore();
    store.cancelReservation(reservationId);
    setRefreshKey(prev => prev + 1);
    setCancellingId(null);
    toast({ variant: 'success', title: 'Réservation annulée', description: 'La réservation a été annulée avec succès.' });
  };

  const handleEdit = (reservation: Reservation) => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    setEditingReservation(reservation);
    setEditStartDate(start.toISOString().split('T')[0]);
    setEditStartTime(start.toTimeString().slice(0,5));
    setEditEndDate(end.toISOString().split('T')[0]);
    setEditEndTime(end.toTimeString().slice(0,5));
    setEditVehiclePlate(reservation.vehiclePlate);
    const user = allUsers.find(u => u.id === reservation.userId);
    if (user) setVehiclePlateOptions(user.vehiclePlates);
    setEditError('');
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (!editingReservation) return;
    const newStart = new Date(`${editStartDate}T${editStartTime}`);
    const newEnd = new Date(`${editEndDate}T${editEndTime}`);
    const now = new Date();
    if (newStart < now) { setEditError('La date de début doit être aujourd\'hui ou ultérieure'); return; }
    if (newStart >= newEnd) { setEditError('La date de fin doit être postérieure à la date de début'); return; }
    if (!editVehiclePlate.trim()) { setEditError('Veuillez saisir une plaque'); return; }
    setIsUpdating(true);
    const store = getStore();
    store.cancelReservation(editingReservation.id);
    const result = store.createReservation(editingReservation.userId, editingReservation.spaceId, newStart, newEnd, editVehiclePlate);
    if (result.success) {
      const user = allUsers.find(u => u.id === editingReservation.userId);
      if (user && !user.vehiclePlates.includes(editVehiclePlate)) {
        store.addVehiclePlate(editingReservation.userId, editVehiclePlate);
      }
      toast({ variant: 'success', title: 'Réservation modifiée', description: 'La réservation a été mise à jour.' });
      setRefreshKey(prev => prev + 1);
      setShowEditModal(false);
      setEditingReservation(null);
    } else {
      setEditError(result.error || 'Erreur lors de la modification');
    }
    setIsUpdating(false);
  };

  const filteredReservations = reservations
    .filter(r => filter === 'all' ? true : r.status === filter)
    .filter(r => {
      if (!searchTerm) return true;
      const store = getStore();
      const space = store.getSpace(r.spaceId);
      const user = store.getUser(r.userId);
      return user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space?.number.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedReservations = filteredReservations.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) pages.push(1, '...');
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages) pages.push('...', totalPages);

    return (
      <div className="flex justify-center items-center gap-2 my-8">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
        >
          &lt;
        </button>
        {pages.map((p, idx) => (
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => goToPage(p)}
              className={`px-3 py-2 rounded-md border transition-colors cursor-pointer ${
                p === currentPage
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-2 text-muted-foreground">…</span>
          )
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
        >
          &gt;
        </button>
      </div>
    );
  };

  if (loading) return <Loading />;

  const isReservationOngoing = (reservation: Reservation) => {
    const now = new Date();
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return (reservation.status === 'active' && start <= now && end >= now);
  };

  const getStatusBadge = (reservation: Reservation) => {
    if (reservation.status === 'active') {
      if (isReservationOngoing(reservation)) {
        return (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">En cours</span>);
      }
      return (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">Active</span>);
    }

    const config: Record<
      string,
      { label: string; color: string }
    > = {
      completed: {
        label: 'Complétée',
        color: 'bg-primary/10 text-primary',
      },
      cancelled: {
        label: 'Annulée',
        color: 'bg-destructive/10 text-destructive',
      },
    };

    const c = config[reservation.status] || {
      label: reservation.status,
      color: 'bg-muted text-muted-foreground',
    };

    return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion des réservations</h1>
        <p className="text-muted-foreground">Visualisez et gérez toutes les réservations du système</p>
      </div>

      <div className="card-base p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="label-base">Recherche</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Nom, plaque ou numéro de place..."
              className="input-base w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="label-base">Statut</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
              className="input-base w-full cursor-pointer sm:w-56"
            >
              <option value="all">Toutes ({reservations.length})</option>
              <option value="active">Actives ({reservations.filter(r => r.status === 'active').length})</option>
              <option value="completed">Complétées ({reservations.filter(r => r.status === 'completed').length})</option>
              <option value="cancelled">Annulées ({reservations.filter(r => r.status === 'cancelled').length})</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => router.push('/admin/parking?msg=new_reservation')} className="btn-primary cursor-pointer">
              + Ajouter une réservation
            </button>
          </div>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="card-base p-6 flex flex-col items-center gap-4 text-center">
          <Mailbox className="w-12 h-12" />
          <p className="text-lg font-semibold text-foreground">Aucune réservation</p>
        </div>
      ) : (
        <>
          <div ref={listRef} className="grid gap-4">
            {displayedReservations.map((reservation) => {
              const store = getStore();
              const space = store.getSpace(reservation.spaceId);
              const user = store.getUser(reservation.userId);
              const startDate = new Date(reservation.startDate);
              const endDate = new Date(reservation.endDate);

              return (
                <div key={reservation.id} className="card-base p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">Réservation #{reservation.id}</h3>{getStatusBadge(reservation)}
                      </div>
                      <p className="text-sm text-muted-foreground">{user?.firstName} {user?.lastName} • {user?.email}</p>
                    </div>
                    {reservation.status === 'active' &&
                      !isReservationOngoing(reservation) && (
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(reservation)} className="btn-secondary text-sm cursor-pointer">Modifier</button>
                          <button onClick={() => {setReservationToCancel(reservation); setShowCancelModal(true);}} disabled={cancellingId === reservation.id} className="btn-secondary text-sm disabled:opacity-50 cursor-pointer">
                            {cancellingId === reservation.id ? (<LoadingDots />) : ('Annuler')}
                          </button>
                        </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm pt-4 border-t border-border">
                    <div>
                      <p className="text-muted-foreground text-xs">Place</p>
                      <p className="font-semibold text-foreground">{space?.number || 'N/A'} (N{space?.level || 'A'})</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Début</p>
                      <p className="font-semibold text-foreground">{startDate.toLocaleDateString('fr-FR')}</p>
                      <p className="text-xs text-muted-foreground">{startDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Fin</p>
                      <p className="font-semibold text-foreground">{endDate.toLocaleDateString('fr-FR')}</p>
                      <p className="text-xs text-muted-foreground">{endDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit',})}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Type</p>
                      <p className="font-semibold text-foreground capitalize">{space?.type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Montant</p>
                      <p className="font-semibold text-foreground text-lg">{reservation.amount.toFixed(2)}€</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Véhicule</p>
                      <p className="font-semibold text-foreground">{reservation.vehiclePlate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && renderPagination()}
        </>
      )}

      <ConfirmationModal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)} 
        onConfirm={() => { if (reservationToCancel) handleCancel(reservationToCancel.id); setShowCancelModal(false); }} 
        title="Annuler la réservation"
        message={"Êtes-vous sûr de vouloir annuler cette réservation ?"}
      >
        <div className="space-y-4">
          {reservationToCancel && (() => {
            const s = getStore().getSpace(reservationToCancel.spaceId);
            return (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2"><span className="font-semibold">Place :</span> {s?.number || 'N/A'}</div>
                <div className="flex items-center gap-2"><span className="font-semibold">Début :</span> {new Date(reservationToCancel.startDate).toLocaleString('fr-FR')}</div>
                <div className="flex items-center gap-2"><span className="font-semibold">Fin :</span> {new Date(reservationToCancel.endDate).toLocaleString('fr-FR')}</div>
              </div>
            );
          })()}
        </div>
      </ConfirmationModal>

      {showEditModal && editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Modifier la réservation</h2>
            <div><label className="label-base">Date de début</label><input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" /></div>
            <div><label className="label-base">Heure de début</label><input type="time" value={editStartTime} onChange={e => setEditStartTime(e.target.value)} className="input-base w-full" /></div>
            <div><label className="label-base">Date de fin</label><input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} min={editStartDate} className="input-base w-full" /></div>
            <div><label className="label-base">Heure de fin</label><input type="time" value={editEndTime} onChange={e => setEditEndTime(e.target.value)} className="input-base w-full" /></div>
            <VehiclePlateInput
              value={editVehiclePlate}
              onChange={setEditVehiclePlate}
              options={vehiclePlateOptions}
              label="Plaque du véhicule"
            />
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            <div className="flex gap-3 pt-4">
              <button onClick={confirmEdit} disabled={isUpdating} className="btn-primary flex-1">{isUpdating ? <LoadingDots /> : 'Mettre à jour'}</button>
              <button onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminReservationsPage() {
  return <Suspense fallback={<Loading />}><AdminReservationsPageContent /></Suspense>;
}