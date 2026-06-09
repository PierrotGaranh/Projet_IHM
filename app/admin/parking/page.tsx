'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel, User, Reservation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ParkingGrid } from '@/components/organisms/ParkingGrid';
import { FilterSection } from '@/components/organisms/FilterSection';
import { AdminParkingSpaceDetail } from '@/components/organisms/AdminParkingSpaceDetail';
import { AddReservationForm } from '@/components/organisms/AddReservationForm';
import { EditReservationForm } from '@/components/organisms/EditReservationForm';
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
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showConfirmReserveModal, setShowConfirmReserveModal] = useState(false);
  const [reservePayload, setReservePayload] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [filterType, setFilterType] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [filterFeature, setFilterFeature] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [selectedLocation, setSelectedLocation] = useState<string>('loc1');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [spacesMap, setSpacesMap] = useState<Record<string, ParkingSpace>>({});
  const detailsRef = useRef<HTMLDivElement>(null);

  const smoothScrollToElement = (el: HTMLElement, offset = 80) => {
    const pos = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: pos - offset, behavior: 'smooth' });
  };

  const statusLabels: Record<string, string> = { available: 'Disponible', occupied: 'Occupée', maintenance: 'Maintenance' };
  const typeLabels: Record<string, string> = { compact: 'Compact', standard: 'Standard', premium: 'Premium' };
  const featureLabels: Record<string, string> = { handicap: 'Handicapé', chargeur: 'Chargeur électrique', surveillée: 'Surveillée', sécurisée: 'Sécurisée' };
  const allStatuses = ['available', 'occupied', 'maintenance'];
  const allTypes = ['compact', 'standard', 'premium'];
  const allFeatures = ['handicap', 'chargeur', 'surveillée', 'sécurisée'];

  useEffect(() => {
    const init: any = {};
    allStatuses.forEach(s => init[s] = 'neutral');
    allTypes.forEach(t => init[t] = 'neutral');
    allFeatures.forEach(f => init[f] = 'neutral');
    setFilterStatus(init); setFilterType(init); setFilterFeature(init);
  }, []);

  useEffect(() => {
    const store = getStore();
    setUsers(store.getAllUsers().filter(u => u.role === 'user'));
  }, []);

  useEffect(() => {
    const store = getStore();
    store.refreshSpaceStatuses();
    const spaces = store.getSpaces(selectedLocation);
    const grouped: Record<number, ParkingSpace[]> = {};
    spaces.forEach(s => { if (!grouped[s.level]) grouped[s.level] = []; grouped[s.level].push(s); });
    const levelsArr = Object.keys(grouped).map(l => ({ level: parseInt(l), spaces: grouped[parseInt(l)], occupancyRate: (grouped[parseInt(l)].filter(s => s.status !== 'available').length / grouped[parseInt(l)].length) * 100 })).sort((a, b) => a.level - b.level);
    setLevels(levelsArr);
    const map: Record<string, ParkingSpace> = {};
    spaces.forEach(s => { map[s.id] = s; });
    setSpacesMap(map);
    setLoading(false);
  }, [refreshKey, selectedLocation]);

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setFilteredReservations([]);
      return;
    }
    const store = getStore();
    const allRes = store.getReservations();
    const filtered = allRes.filter(r => {
      const space = store.getSpace(r.spaceId);
      if (!space || space.locationId !== selectedLocation) return false;
      if (r.startDate >= dateRange.startDate! && r.endDate <= dateRange.endDate!) return true;
      return false;
    });
    setFilteredReservations(filtered);
  }, [dateRange, selectedLocation]);

  useEffect(() => {
    if (selectedSpace && detailsRef.current) {
      smoothScrollToElement(detailsRef.current);
    }
  }, [selectedSpace]);

  const applyFilters = (space: ParkingSpace) => {
    let ok = true;
    for (const [val, state] of Object.entries(filterStatus)) { if (state === 'selected' && space.status !== val) ok = false; if (state === 'deselected' && space.status === val) ok = false; if (!ok) break; }
    if (!ok) return false;
    for (const [val, state] of Object.entries(filterType)) { if (state === 'selected' && space.type !== val) ok = false; if (state === 'deselected' && space.type === val) ok = false; if (!ok) break; }
    if (!ok) return false;
    for (const [val, state] of Object.entries(filterFeature)) { if (state === 'selected' && !space.features.includes(val)) ok = false; if (state === 'deselected' && space.features.includes(val)) ok = false; if (!ok) break; }
    return ok;
  };

  const filteredLevels = levels.map(l => ({ ...l, spaces: l.spaces.filter(applyFilters) })).filter(l => l.spaces.length > 0);
  const selectedCount = Object.values(filterStatus).filter(s => s === 'selected').length + Object.values(filterType).filter(s => s === 'selected').length + Object.values(filterFeature).filter(s => s === 'selected').length;
  const deselectedCount = Object.values(filterStatus).filter(s => s === 'deselected').length + Object.values(filterType).filter(s => s === 'deselected').length + Object.values(filterFeature).filter(s => s === 'deselected').length;

  const handleMaintenance = (spaceId: string, toMaintenance: boolean) => {
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
      toast({ variant: 'success', title: newStatus === 'maintenance' ? 'Place en maintenance' : 'Place disponible', description: `La place a été mise ${newStatus === 'maintenance' ? 'en maintenance' : 'disponible'}.` });
    }
    setShowStatusModal(false);
    setSpaceToChange(null);
    setNewStatus(null);
  };

  const handleReserveForUser = () => setShowReserveModal(true);
  const handleEditReservationForAdmin = () => {
    const store = getStore();
    const reservation = store.getReservations().find(r => r.spaceId === selectedSpace?.id && r.status === 'active');
    if (reservation) { setEditingReservation(reservation); setShowEditReservationModal(true); }
  };

  const prepareReserve = async (data: { userId: string; startDate: Date; endDate: Date; vehiclePlate: string }) => {
    setSelectedUserId(data.userId);
    setVehiclePlate(data.vehiclePlate);
    setReservePayload({ start: data.startDate, end: data.endDate });
    setShowConfirmReserveModal(true);
  };

  const confirmReserve = () => {
    if (!reservePayload || !selectedSpace) return;
    const { start, end } = reservePayload;
    const store = getStore();
    const result = store.createReservation(selectedUserId, selectedSpace.id, start, end, vehiclePlate);
    if (result.success) {
      const u = users.find(u => u.id === selectedUserId);
      if (u && !u.vehiclePlates.includes(vehiclePlate)) store.addVehiclePlate(selectedUserId, vehiclePlate);
      toast({ variant: 'success', title: 'Réservation créée', description: `Réservation pour ${u?.firstName} effectuée.` });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setShowReserveModal(false);
      setShowConfirmReserveModal(false);
    } else {
      toast({ variant: 'error', title: 'Erreur', description: result.error || 'Erreur lors de la réservation' });
    }
  };

  const prepareEditReservation = async (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => {
    setVehiclePlate(data.vehiclePlate);
    setReservePayload({ start: data.startDate, end: data.endDate });
    setShowConfirmReserveModal(true);
  };

  const confirmEditReservation = () => {
    if (!editingReservation || !selectedSpace || !reservePayload) return;
    const { start, end } = reservePayload;
    const store = getStore();
    store.cancelReservation(editingReservation.id);
    const result = store.createReservation(editingReservation.userId, selectedSpace.id, start, end, vehiclePlate);
    if (result.success) {
      const u = users.find(u => u.id === editingReservation.userId);
      if (u && !u.vehiclePlates.includes(vehiclePlate)) store.addVehiclePlate(editingReservation.userId, vehiclePlate);
      toast({ variant: 'success', title: 'Réservation modifiée', description: 'La réservation a été mise à jour.' });
      setRefreshKey(prev => prev + 1);
      setSelectedSpace(null);
      setShowEditReservationModal(false);
      setShowConfirmReserveModal(false);
      setEditingReservation(null);
    } else {
      toast({ variant: 'error', title: 'Erreur', description: result.error || 'Erreur lors de la modification' });
    }
  };

  const clearSelectedSpace = () => setSelectedSpace(null);
  const location = getStore().getLocations().find(l => l.id === selectedLocation)!;

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="space-y-2"><h1 className="text-3xl font-bold">Gestion du parking</h1><p className="text-muted-foreground">Gérez les statuts et configurations des places</p></div>
      <FilterSection
        selectedCount={selectedCount}
        deselectedCount={deselectedCount}
        sections={[
          { label: 'Statut', items: allStatuses.map(s => ({ value: s, label: statusLabels[s], state: filterStatus[s] })), onItemClick: (v) => setFilterStatus(prev => ({ ...prev, [v]: prev[v] === 'neutral' ? 'selected' : prev[v] === 'selected' ? 'deselected' : 'neutral' })) },
          { label: 'Type', items: allTypes.map(t => ({ value: t, label: typeLabels[t], state: filterType[t] })), onItemClick: (v) => setFilterType(prev => ({ ...prev, [v]: prev[v] === 'neutral' ? 'selected' : prev[v] === 'selected' ? 'deselected' : 'neutral' })) },
          { label: 'Équipements', items: allFeatures.map(f => ({ value: f, label: featureLabels[f], state: filterFeature[f] })), onItemClick: (v) => setFilterFeature(prev => ({ ...prev, [v]: prev[v] === 'neutral' ? 'selected' : prev[v] === 'selected' ? 'deselected' : 'neutral' })) }
        ]}
        onLocationChange={setSelectedLocation}
        selectedLocation={selectedLocation}
        onDateRangeChange={setDateRange}
        dateRange={dateRange}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParkingGrid
            levels={filteredLevels}
            selectedSpaceId={selectedSpace?.id}
            onSelectSpace={setSelectedSpace}
            isAdmin
            adminSelectableStatuses={['available', 'maintenance']}
          />
        </div>
        <div ref={detailsRef} className="space-y-4">
          {selectedSpace ? (
            <AdminParkingSpaceDetail
              space={selectedSpace}
              location={{ address: location.address, lat: location.lat, lng: location.lng }}
              reservations={filteredReservations.filter(r => r.spaceId === selectedSpace.id)}
              spacesMap={spacesMap}
              onClear={clearSelectedSpace}
              onReserveForUser={handleReserveForUser}
              onMaintenance={() => handleMaintenance(selectedSpace.id, true)}
              onRemoveMaintenance={() => handleMaintenance(selectedSpace.id, false)}
              onEditReservation={(res) => {
                setEditingReservation(res);
                setShowEditReservationModal(true);
              }}
              onCancelReservation={(id) => {
                getStore().cancelReservation(id);
                setRefreshKey(prev => prev + 1);
                toast({ variant: 'success', title: 'Réservation annulée' });
              }}
              dateRange={dateRange}
            />
          ) : (
            <div className="card-base p-6 text-center text-muted-foreground">Sélectionnez une place</div>
          )}
        </div>
      </div>

      <ConfirmationModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} onConfirm={confirmStatusChange} title="Changer le statut" message={`Êtes-vous sûr de vouloir mettre la place ${selectedSpace?.number} ${newStatus === 'maintenance' ? 'en maintenance' : 'disponible'} ?`} />

      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Réserver pour un utilisateur</h2>
            <AddReservationForm users={users} onSubmit={prepareReserve} onCancel={() => setShowReserveModal(false)} />
          </div>
        </div>
      )}

      {showEditReservationModal && editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Modifier la réservation</h2>
            <EditReservationForm
              reservation={editingReservation}
              pricePerHour={getStore().getSpace(editingReservation.spaceId)?.pricePerHour || 0}
              userPlates={users.find(u => u.id === editingReservation.userId)?.vehiclePlates || []}
              userName={users.find(u => u.id === editingReservation.userId)?.firstName}
              onSubmit={prepareEditReservation}
              onCancel={() => setShowEditReservationModal(false)}
            />
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={showConfirmReserveModal} onClose={() => setShowConfirmReserveModal(false)} onConfirm={editingReservation ? confirmEditReservation : confirmReserve} title={editingReservation ? 'Modifier la réservation' : 'Confirmer la réservation'} message={editingReservation ? `Modifier la réservation pour la place ${selectedSpace?.number} ?` : `Réserver la place ${selectedSpace?.number} ?`} />
    </div>
  );
}

export default function ParkingManagementPage() { return <Suspense fallback={<Loading />}><ParkingManagementPageContent /></Suspense>; }