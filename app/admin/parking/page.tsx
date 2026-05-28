'use client';

import { Suspense, useEffect, useState } from 'react';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel, User, Reservation } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { ParkingGrid } from '@/components/parking-grid';
import { FilterSection } from '@/components/filter-section';
import { VehiclePlateInput } from '@/components/vehicle-plate-input';
import { X } from 'lucide-react';
import Loading from './loading';

function ParkingManagementPageContent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
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
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehiclePlateOptions, setVehiclePlateOptions] = useState<string[]>([]);
  const [showConfirmReserveModal, setShowConfirmReserveModal] = useState(false);
  const [reservePayload, setReservePayload] = useState<any>(null);
  const [messageFromReservations, setMessageFromReservations] = useState('');

  const statusLabels: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Occupée',
    reserved: 'Réservée',
    maintenance: 'Maintenance'
  };
  const typeLabels: Record<string, string> = {
    compact: 'Compact',
    standard: 'Standard',
    premium: 'Premium'
  };
  const featureLabels: Record<string, string> = {
    handicap: 'Handicapé',
    chargeur: 'Chargeur électrique',
    abritée: 'Abritée',
    sécurisée: 'Sécurisée'
  };

  const allStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
  const allTypes = ['compact', 'standard', 'premium'];
  const allFeatures = ['handicap', 'chargeur', 'abritée', 'sécurisée'];

  const [filterStatus, setFilterStatus] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [filterType, setFilterType] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [filterFeature, setFilterFeature] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});

  useEffect(() => {
    const initial: Record<string, 'neutral' | 'selected' | 'deselected'> = {};
    allStatuses.forEach(s => initial[s] = 'neutral');
    allTypes.forEach(t => initial[t] = 'neutral');
    allFeatures.forEach(f => initial[f] = 'neutral');
    setFilterStatus(initial);
    setFilterType(initial);
    setFilterFeature(initial);
  }, []);

  useEffect(() => {
    const store = getStore();
    const allUsers = store.getAllUsers();
    setUsers(allUsers.filter(u => u.role === 'user'));
    setFilteredUsers(allUsers.filter(u => u.role === 'user'));
  }, []);

  useEffect(() => {
    if (searchUserQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(u => u.firstName.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.lastName.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.email.toLowerCase().includes(searchUserQuery.toLowerCase())));
    }
  }, [searchUserQuery, users]);

  const fetchData = () => {
    const store = getStore();
    store.refreshSpaceStatuses();
    const spaces = store.getSpaces();
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
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg === 'new_reservation') {
      setMessageFromReservations('Veuillez sélectionner une place pour l\'utilisateur');
      window.history.replaceState({}, '', '/admin/parking');
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        setVehiclePlateOptions(user.vehiclePlates);
        setVehiclePlate('');
      }
    } else {
      setVehiclePlateOptions([]);
    }
  }, [selectedUserId, users]);

  if (loading) return <Loading />;

  const handleMaintenanceRequest = (spaceId: string, toMaintenance: boolean) => {
    setSpaceToChange(spaceId);
    setNewStatus(toMaintenance ? 'maintenance' : 'available');
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    if (spaceToChange && newStatus) {
      const store = getStore();
      store.updateSpace(spaceToChange, { status: newStatus as any });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
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
    setSearchUserQuery('');
    setVehiclePlate('');
    setVehiclePlateOptions([]);
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
      setVehiclePlate(reservation.vehiclePlate);
      const user = users.find(u => u.id === reservation.userId);
      if (user) setVehiclePlateOptions(user.vehiclePlates);
      setShowEditReservationModal(true);
      setReserveError('');
    }
  };

  const prepareReserve = () => {
    if (!selectedUserId) {
      setReserveError('Veuillez sélectionner un utilisateur');
      return;
    }
    if (!selectedSpace) {
      setReserveError('Veuillez sélectionner une place');
      return;
    }
    if (!vehiclePlate.trim()) {
      setReserveError('Veuillez saisir une plaque');
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
    setReservePayload({ start, end });
    setShowConfirmReserveModal(true);
  };

  const confirmReserve = () => {
    if (!reservePayload) return;
    const { start, end } = reservePayload;
    setIsReserving(true);
    const store = getStore();
    const result = store.createReservation(selectedUserId, selectedSpace!.id, start, end, vehiclePlate);
    if (result.success) {
      const user = users.find(u => u.id === selectedUserId);
      if (user && !user.vehiclePlates.includes(vehiclePlate)) {
        store.addVehiclePlate(selectedUserId, vehiclePlate);
      }
      toast({ variant: 'success', title: 'Réservation créée', description: `Réservation pour ${user?.firstName} effectuée.` });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setShowReserveModal(false);
      setShowConfirmReserveModal(false);
    } else {
      setReserveError(result.error || 'Erreur lors de la réservation');
    }
    setIsReserving(false);
  };

  const prepareEditReservation = () => {
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
    setReservePayload({ start: newStart, end: newEnd });
    setShowConfirmReserveModal(true);
  };

  const confirmEditReservation = () => {
    if (!editingReservation || !selectedSpace || !reservePayload) return;
    const { start, end } = reservePayload;
    setIsReserving(true);
    const store = getStore();
    store.cancelReservation(editingReservation.id);
    const result = store.createReservation(editingReservation.userId, selectedSpace.id, start, end, vehiclePlate);
    if (result.success) {
      const user = users.find(u => u.id === editingReservation.userId);
      if (user && !user.vehiclePlates.includes(vehiclePlate)) {
        store.addVehiclePlate(editingReservation.userId, vehiclePlate);
      }
      toast({ variant: 'success', title: 'Réservation modifiée', description: 'La réservation a été mise à jour.' });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setShowEditReservationModal(false);
      setShowConfirmReserveModal(false);
      setEditingReservation(null);
    } else {
      setReserveError(result.error || 'Erreur lors de la modification');
    }
    setIsReserving(false);
  };

  const applyFilters = (space: ParkingSpace) => {
    let statusMatches = true;
    for (const [val, state] of Object.entries(filterStatus)) {
      if (state === 'selected' && space.status !== val) { statusMatches = false; break; }
      if (state === 'deselected' && space.status === val) { statusMatches = false; break; }
    }
    let typeMatches = true;
    for (const [val, state] of Object.entries(filterType)) {
      if (state === 'selected' && space.type !== val) { typeMatches = false; break; }
      if (state === 'deselected' && space.type === val) { typeMatches = false; break; }
    }
    let featureMatches = true;
    for (const [val, state] of Object.entries(filterFeature)) {
      if (state === 'selected' && !space.features.includes(val)) { featureMatches = false; break; }
      if (state === 'deselected' && space.features.includes(val)) { featureMatches = false; break; }
    }
    return statusMatches && typeMatches && featureMatches;
  };

  const filteredLevels = levels.map(level => ({
    ...level,
    spaces: level.spaces.filter(applyFilters)
  })).filter(level => level.spaces.length > 0);

  const selectedCount = Object.values(filterStatus).filter(s => s === 'selected').length +
    Object.values(filterType).filter(s => s === 'selected').length +
    Object.values(filterFeature).filter(s => s === 'selected').length;
  const deselectedCount = Object.values(filterStatus).filter(s => s === 'deselected').length +
    Object.values(filterType).filter(s => s === 'deselected').length +
    Object.values(filterFeature).filter(s => s === 'deselected').length;

  const clearSelectedSpace = () => setSelectedSpace(null);

  return (
    <div className="space-y-8">
      {messageFromReservations && (
        <div className="sticky top-0 z-40 bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-lg flex justify-between items-center backdrop-blur-sm">
          <span>{messageFromReservations}</span>
          <button onClick={() => setMessageFromReservations('')} className="text-secondary"><X className="w-4 h-4" /></button>
        </div>
      )}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion du parking</h1>
        <p className="text-muted-foreground">Gérez les statuts et configurations des places de parking</p>
      </div>

      <FilterSection
        title="Filtres"
        selectedCount={selectedCount}
        deselectedCount={deselectedCount}
        sections={[
          {
            label: 'Statut',
            items: allStatuses.map(s => ({ value: s, label: statusLabels[s], state: filterStatus[s] })),
            onItemClick: (value) => setFilterStatus(prev => {
              const current = prev[value];
              let next: 'neutral' | 'selected' | 'deselected' = 'neutral';
              if (current === 'neutral') next = 'selected';
              else if (current === 'selected') next = 'deselected';
              else next = 'neutral';
              return { ...prev, [value]: next };
            })
          },
          {
            label: 'Type',
            items: allTypes.map(t => ({ value: t, label: typeLabels[t], state: filterType[t] })),
            onItemClick: (value) => setFilterType(prev => {
              const current = prev[value];
              let next: 'neutral' | 'selected' | 'deselected' = 'neutral';
              if (current === 'neutral') next = 'selected';
              else if (current === 'selected') next = 'deselected';
              else next = 'neutral';
              return { ...prev, [value]: next };
            })
          },
          {
            label: 'Équipements',
            items: allFeatures.map(f => ({ value: f, label: featureLabels[f], state: filterFeature[f] })),
            onItemClick: (value) => setFilterFeature(prev => {
              const current = prev[value];
              let next: 'neutral' | 'selected' | 'deselected' = 'neutral';
              if (current === 'neutral') next = 'selected';
              else if (current === 'selected') next = 'deselected';
              else next = 'neutral';
              return { ...prev, [value]: next };
            })
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParkingGrid
            levels={filteredLevels}
            selectedSpaceId={selectedSpace?.id}
            onSelectSpace={setSelectedSpace}
            isAdmin={true}
            adminSelectableStatuses={['available', 'reserved', 'maintenance']}
          />
        </div>

        <div className="space-y-4">
          {selectedSpace ? (
            <div className="card-base p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-foreground text-lg">Détails de la place</h3>
                <button onClick={clearSelectedSpace} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div><p className="text-muted-foreground">Numéro</p><p className="font-semibold text-foreground text-lg">{selectedSpace.number}</p></div>
                <div><p className="text-muted-foreground">Niveau</p><p className="font-semibold text-foreground">{selectedSpace.level}</p></div>
                <div><p className="text-muted-foreground">Type</p><p className="font-semibold text-foreground capitalize">{typeLabels[selectedSpace.type]}</p></div>
                <div><p className="text-muted-foreground">Prix/heure</p><p className="font-semibold text-foreground">{selectedSpace.pricePerHour}€</p></div>
                <div className="pt-3 border-t border-border"><p className="text-muted-foreground text-xs font-semibold">ÉQUIPEMENTS</p>
                  {selectedSpace.features.length > 0 ? <div className="flex flex-wrap gap-2 mt-1">{selectedSpace.features.map(f => <span key={f} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{featureLabels[f]}</span>)}</div> : <p className="text-xs text-muted-foreground">Aucun équipement</p>}
                </div>
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  ACTION(S) ADMIN
                </p>

                <div className="space-y-2">
                  
                  {/* Place disponible */}
                  {selectedSpace.status === 'available' && (
                    <>
                      <button
                        onClick={handleReserveForUser}
                        className="btn-primary w-full cursor-pointer"
                      >
                        Réserver pour un utilisateur
                      </button>

                      <button
                        onClick={handleEditReservationForAdmin}
                        className="btn-secondary w-full cursor-pointer"
                      >
                        Modifier la réservation
                      </button>

                      <button
                        onClick={() =>
                          handleMaintenanceRequest(selectedSpace.id, true)
                        }
                        className="btn-secondary w-full border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        Mettre en maintenance
                      </button>
                    </>
                  )}

                  {/* Place réservée */}
                  {selectedSpace.status === 'reserved' && (
                    <button
                      onClick={handleEditReservationForAdmin}
                      className="btn-secondary w-full cursor-pointer"
                    >
                      Modifier la réservation
                    </button>
                  )}

                  {/* Place en maintenance */}
                  {selectedSpace.status === 'maintenance' && (
                    <button
                      onClick={() =>
                        handleMaintenanceRequest(selectedSpace.id, false)
                      }
                      className="btn-secondary w-full cursor-pointer"
                    >
                      Retirer de maintenance
                    </button>
                  )}

                </div>
              </div>
            </div>
          ) : (
            <div className="card-base p-6 text-center text-muted-foreground space-y-2"><p className="text-lg">P</p><p>Sélectionnez une place</p><p className="text-xs">pour voir les détails</p></div>
          )}
          <div className="card-base p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Statistiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total places</span><span className="font-semibold">{filteredLevels.flatMap(l => l.spaces).length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disponibles</span><span className="font-semibold text-secondary">{filteredLevels.flatMap(l => l.spaces).filter(s => s.status === 'available').length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Occupées</span><span className="font-semibold text-destructive">{filteredLevels.flatMap(l => l.spaces).filter(s => s.status === 'occupied').length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Réservées</span><span className="font-semibold text-primary">{filteredLevels.flatMap(l => l.spaces).filter(s => s.status === 'reserved').length}</span></div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmStatusChange}
        title="Changer le statut"
        message={`Êtes-vous sûr de vouloir mettre la place ${selectedSpace?.number} ${newStatus === 'maintenance' ? 'en maintenance' : 'disponible'} ?`}
      />

      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-foreground">Réserver pour un utilisateur</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="label-base">Rechercher / Sélectionner un utilisateur</label>
                <input type="text" value={searchUserQuery} onChange={(e) => setSearchUserQuery(e.target.value)} placeholder="Nom, prénom ou email" className="input-base w-full" />
                <select size={5} value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="input-base w-full mt-2">
                  <option value="">Sélectionnez un utilisateur</option>
                  {filteredUsers.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>)}
                </select>
              </div>
              <VehiclePlateInput
                value={vehiclePlate}
                onChange={setVehiclePlate}
                options={vehiclePlateOptions}
                label="Plaque du véhicule"
              />
              <div><label className="label-base">Date de début</label><input type="date" value={reserveStartDate} onChange={e => setReserveStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" /></div>
              <div><label className="label-base">Heure de début</label><input type="time" value={reserveStartTime} onChange={e => setReserveStartTime(e.target.value)} className="input-base w-full" /></div>
              <div><label className="label-base">Date de fin</label><input type="date" value={reserveEndDate} onChange={e => setReserveEndDate(e.target.value)} min={reserveStartDate} className="input-base w-full" /></div>
              <div><label className="label-base">Heure de fin</label><input type="time" value={reserveEndTime} onChange={e => setReserveEndTime(e.target.value)} className="input-base w-full" /></div>
              {reserveError && <p className="text-sm text-destructive">{reserveError}</p>}
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={prepareReserve} disabled={isReserving} className="btn-primary flex-1">{isReserving ? <LoadingDots /> : 'Confirmer'}</button>
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
              <div><label className="label-base">Date de début</label><input type="date" value={reserveStartDate} onChange={e => setReserveStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" /></div>
              <div><label className="label-base">Heure de début</label><input type="time" value={reserveStartTime} onChange={e => setReserveStartTime(e.target.value)} className="input-base w-full" /></div>
              <div><label className="label-base">Date de fin</label><input type="date" value={reserveEndDate} onChange={e => setReserveEndDate(e.target.value)} min={reserveStartDate} className="input-base w-full" /></div>
              <div><label className="label-base">Heure de fin</label><input type="time" value={reserveEndTime} onChange={e => setReserveEndTime(e.target.value)} className="input-base w-full" /></div>
              <VehiclePlateInput
                value={vehiclePlate}
                onChange={setVehiclePlate}
                options={vehiclePlateOptions}
                label="Plaque du véhicule"
              />
              {reserveError && <p className="text-sm text-destructive">{reserveError}</p>}
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={prepareEditReservation} disabled={isReserving} className="btn-primary flex-1">{isReserving ? <LoadingDots /> : 'Mettre à jour'}</button>
              <button onClick={() => setShowEditReservationModal(false)} className="btn-secondary flex-1">Annuler</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmReserveModal}
        onClose={() => setShowConfirmReserveModal(false)}
        onConfirm={editingReservation ? confirmEditReservation : confirmReserve}
        title={editingReservation ? "Modifier la réservation" : "Confirmer la réservation"}
        message={editingReservation 
          ? `Êtes-vous sûr de vouloir modifier la réservation pour la place ${selectedSpace?.number} ?`
          : `Êtes-vous sûr de vouloir réserver la place ${selectedSpace?.number} pour l'utilisateur sélectionné ?`
        }
      >
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2"><span className="font-semibold">Début :</span> {reservePayload?.start.toLocaleString('fr-FR')}</div>
            <div className="flex items-center gap-2"><span className="font-semibold">Fin :</span> {reservePayload?.end.toLocaleString('fr-FR')}</div>
            <div className="flex items-center gap-2"><span className="font-semibold">Plaque :</span> {vehiclePlate}</div>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default function ParkingManagementPage() {return <Suspense fallback={<Loading />}><ParkingManagementPageContent /></Suspense>}