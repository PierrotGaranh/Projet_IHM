'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel, User, Reservation } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { ParkingGrid } from '@/components/parking-grid';
import Loading from './loading';

function ParkingManagementPageContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'reserved' | 'maintenance'>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [changingSpaceId, setChangingSpaceId] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [spaceToChange, setSpaceToChange] = useState<string | null>(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showEditReservationModal, setShowEditReservationModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [reserveStartDate, setReserveStartDate] = useState('');
  const [reserveStartTime, setReserveStartTime] = useState('09:00');
  const [reserveEndDate, setReserveEndDate] = useState('');
  const [reserveEndTime, setReserveEndTime] = useState('17:00');
  const [reserveError, setReserveError] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const fetchData = () => {
    const store = getStore();
    const spaces = store.getSpaces();
    const allUsers = store.getAllUsers();
    setUsers(allUsers.filter(u => u.role === 'user'));
    
    const groupedByLevel: Record<number, ParkingSpace[]> = {};
    spaces.forEach(space => {
      if (!groupedByLevel[space.level]) groupedByLevel[space.level] = [];
      groupedByLevel[space.level].push(space);
    });

    const levelArray = Object.keys(groupedByLevel)
      .map(level => ({
        level: parseInt(level),
        spaces: groupedByLevel[parseInt(level)],
        occupancyRate: (groupedByLevel[parseInt(level)].filter(s => s.status !== 'available').length / 
          groupedByLevel[parseInt(level)].length) * 100,
      }))
      .sort((a, b) => a.level - b.level);

    setLevels(levelArray);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  if (loading) return <Loading />;

  const handleMaintenanceRequest = (spaceId: string, toMaintenance: boolean) => {
    setSpaceToChange(spaceId);
    setNewStatus(toMaintenance ? 'maintenance' : 'available');
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    if (spaceToChange && newStatus) {
      setChangingSpaceId(spaceToChange);
      const store = getStore();
      store.updateSpace(spaceToChange, { status: newStatus as any });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setChangingSpaceId(null);
      toast({
        variant: 'success',
        title: newStatus === 'maintenance' ? 'Place en maintenance' : 'Place disponible',
        description: `La place a été mise ${newStatus === 'maintenance' ? 'en maintenance' : 'disponible'}.`,
      });
    }
    setShowStatusModal(false);
    setSpaceToChange(null);
    setNewStatus(null);
  };

  const handleReserveForUser = () => {
    setShowReserveModal(true);
    const today = new Date().toISOString().split('T')[0];
    setReserveStartDate(today);
    setReserveEndDate(today);
    setReserveError('');
    setSelectedUserId('');
  };

  const handleEditReservationForAdmin = () => {
    const store = getStore();
    const reservation = store.getReservations().find(r => r.spaceId === selectedSpace?.id && r.status === 'active');
    if (reservation) {
      setEditingReservation(reservation);
      setReserveStartDate(new Date(reservation.startDate).toISOString().split('T')[0]);
      setReserveStartTime(new Date(reservation.startDate).toTimeString().slice(0,5));
      setReserveEndDate(new Date(reservation.endDate).toISOString().split('T')[0]);
      setReserveEndTime(new Date(reservation.endDate).toTimeString().slice(0,5));
      setSelectedUserId(reservation.userId);
      setShowEditReservationModal(true);
      setReserveError('');
    }
  };

  const confirmReserve = () => {
    setReserveError('');
    if (!selectedUserId) {
      setReserveError('Veuillez sélectionner un utilisateur');
      return;
    }
    if (!selectedSpace) {
      setReserveError('Veuillez sélectionner une place');
      return;
    }
    const start = new Date(`${reserveStartDate}T${reserveStartTime}`);
    const end = new Date(`${reserveEndDate}T${reserveEndTime}`);
    const now = new Date();
    if (start < now) {
      setReserveError('La date de début doit être aujourd\'hui ou ultérieure');
      return;
    }
    if (start >= end) {
      setReserveError('La date de fin doit être antérieure à la date de début');
      return;
    }
    setIsReserving(true);
    const store = getStore();
    const result = store.createReservation(selectedUserId, selectedSpace.id, start, end);
    if (result.success) {
      toast({ variant: 'success', title: 'Réservation créée', description: `Réservation pour ${users.find(u => u.id === selectedUserId)?.firstName} effectuée.` });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setShowReserveModal(false);
    } else {
      setReserveError(result.error || 'Erreur lors de la réservation');
    }
    setIsReserving(false);
  };

  const confirmEditReservation = () => {
    if (!editingReservation || !selectedSpace) return;
    const newStart = new Date(`${reserveStartDate}T${reserveStartTime}`);
    const newEnd = new Date(`${reserveEndDate}T${reserveEndTime}`);
    const now = new Date();
    if (newStart < now) {
      setReserveError('La date de début doit être aujourd\'hui ou ultérieure');
      return;
    }
    if (newStart >= newEnd) {
      setReserveError('La date de fin doit être antérieure à la date de début');
      return;
    }
    setIsReserving(true);
    const store = getStore();
    store.cancelReservation(editingReservation.id);
    const result = store.createReservation(editingReservation.userId, selectedSpace.id, newStart, newEnd);
    if (result.success) {
      toast({ variant: 'success', title: 'Réservation modifiée', description: 'La réservation a été mise à jour.' });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setShowEditReservationModal(false);
      setEditingReservation(null);
    } else {
      setReserveError(result.error || 'Erreur lors de la modification');
    }
    setIsReserving(false);
  };

  const filteredLevels = levels
    .filter(level => filterLevel === 'all' || level.level === filterLevel)
    .map(level => ({
      ...level,
      spaces: level.spaces.filter(space => filterStatus === 'all' || space.status === filterStatus),
    }))
    .filter(level => level.spaces.length > 0);

  const filteredSpaces = filteredLevels.flatMap(level => level.spaces);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion du parking</h1>
        <p className="text-muted-foreground">Gérez les statuts et configurations des places de parking</p>
      </div>

      <div className="card-base p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label-base">Filtre par niveau</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="input-base w-full cursor-pointer"
            >
              <option value="all">Tous les niveaux</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>Niveau {level}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="label-base">Filtre par statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input-base w-full cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="occupied">Occupée</option>
              <option value="reserved">Réservée</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParkingGrid
            levels={filteredLevels}
            selectedSpaceId={selectedSpace?.id}
            onSelectSpace={setSelectedSpace}
            isAdmin={true}
          />
        </div>

        <div className="space-y-4">
          {selectedSpace ? (
            <div className="card-base p-6 space-y-4 sticky top-24">
              <h3 className="font-semibold text-foreground text-lg">Détails de la place</h3>
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Numéro</p>
                  <p className="font-semibold text-foreground text-lg">{selectedSpace.number}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Niveau</p>
                  <p className="font-semibold text-foreground">{selectedSpace.level}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-semibold text-foreground capitalize">{selectedSpace.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Prix/heure</p>
                  <p className="font-semibold text-foreground">{selectedSpace.pricePerHour}€</p>
                </div>
                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-muted-foreground text-xs font-semibold">ÉQUIPEMENTS</p>
                  {selectedSpace.features.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSpace.features.map(feature => (
                        <span key={feature} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{feature}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Aucun équipement</p>
                  )}
                </div>
              </div>

              {/* ACTIONS ADMIN : 3 boutons */}
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">ACTIONS ADMIN</p>
                <div className="space-y-2">
                  <button onClick={handleReserveForUser} className="btn-primary w-full cursor-pointer">
                    Réserver pour un utilisateur
                  </button>
                  {selectedSpace.status === 'reserved' && (
                    <button onClick={handleEditReservationForAdmin} className="btn-secondary w-full cursor-pointer">
                      Modifier la réservation
                    </button>
                  )}
                  {selectedSpace.status !== 'maintenance' ? (
                    <button onClick={() => handleMaintenanceRequest(selectedSpace.id, true)} className="btn-secondary w-full border-destructive text-destructive hover:bg-destructive/10 cursor-pointer">
                      Mettre en maintenance
                    </button>
                  ) : (
                    <button onClick={() => handleMaintenanceRequest(selectedSpace.id, false)} className="btn-secondary w-full cursor-pointer">
                      Retirer de maintenance
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-base p-6 text-center text-muted-foreground space-y-2">
              <p className="text-lg">P</p>
              <p>Sélectionnez une place</p>
              <p className="text-xs">pour voir les détails</p>
            </div>
          )}

          <div className="card-base p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Statistiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total places</span>
                <span className="font-semibold">{filteredSpaces.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disponibles</span>
                <span className="font-semibold text-secondary">
                  {filteredSpaces.filter(s => s.status === 'available').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupées</span>
                <span className="font-semibold text-destructive">
                  {filteredSpaces.filter(s => s.status === 'occupied').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Réservées</span>
                <span className="font-semibold text-primary">
                  {filteredSpaces.filter(s => s.status === 'reserved').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmStatusChange}
        title="Changer le statut"
        message={`Êtes-vous sûr de vouloir mettre cette place ${newStatus === 'maintenance' ? 'en maintenance' : 'disponible'} ?`}
      />

      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Réserver pour un utilisateur</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="label-base">Utilisateur</label>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="input-base w-full cursor-pointer">
                  <option value="">Sélectionnez un utilisateur</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="label-base">Date de début</label>
                <input type="date" value={reserveStartDate} onChange={(e) => setReserveStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" />
              </div>
              <div className="space-y-1">
                <label className="label-base">Heure de début</label>
                <input type="time" value={reserveStartTime} onChange={(e) => setReserveStartTime(e.target.value)} className="input-base w-full" />
              </div>
              <div className="space-y-1">
                <label className="label-base">Date de fin</label>
                <input type="date" value={reserveEndDate} onChange={(e) => setReserveEndDate(e.target.value)} min={reserveStartDate || new Date().toISOString().split('T')[0]} className="input-base w-full" />
              </div>
              <div className="space-y-1">
                <label className="label-base">Heure de fin</label>
                <input type="time" value={reserveEndTime} onChange={(e) => setReserveEndTime(e.target.value)} className="input-base w-full" />
              </div>
              {reserveError && <p className="text-sm text-destructive">{reserveError}</p>}
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={confirmReserve} disabled={isReserving} className="btn-primary flex-1">
                {isReserving ? <LoadingDots /> : 'Confirmer'}
              </button>
              <button onClick={() => setShowReserveModal(false)} className="btn-secondary flex-1">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showEditReservationModal && editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Modifier la réservation</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="label-base">Date de début</label>
                <input type="date" value={reserveStartDate} onChange={(e) => setReserveStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" />
              </div>
              <div className="space-y-1">
                <label className="label-base">Heure de début</label>
                <input type="time" value={reserveStartTime} onChange={(e) => setReserveStartTime(e.target.value)} className="input-base w-full" />
              </div>
              <div className="space-y-1">
                <label className="label-base">Date de fin</label>
                <input type="date" value={reserveEndDate} onChange={(e) => setReserveEndDate(e.target.value)} min={reserveStartDate} className="input-base w-full" />
              </div>
              <div className="space-y-1">
                <label className="label-base">Heure de fin</label>
                <input type="time" value={reserveEndTime} onChange={(e) => setReserveEndTime(e.target.value)} className="input-base w-full" />
              </div>
              {reserveError && <p className="text-sm text-destructive">{reserveError}</p>}
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={confirmEditReservation} disabled={isReserving} className="btn-primary flex-1">
                {isReserving ? <LoadingDots /> : 'Mettre à jour'}
              </button>
              <button onClick={() => setShowEditReservationModal(false)} className="btn-secondary flex-1">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParkingManagementPage() {return <Suspense fallback={<Loading />}><ParkingManagementPageContent /></Suspense>};