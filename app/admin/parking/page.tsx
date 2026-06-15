'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingSection, User, Reservation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/atoms/Card';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ParkingGrid } from '@/components/organisms/ParkingGrid';
import { FilterSection } from '@/components/organisms/FilterSection';
import { AdminParkingSpaceDetail } from '@/components/organisms/AdminParkingSpaceDetail';
import { AddReservationForm } from '@/components/organisms/AddReservationForm';
import { EditReservationForm } from '@/components/organisms/EditReservationForm';
import { X, Info } from 'lucide-react';
import Loading from './loading';

function ParkingManagementPageContent() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<ParkingSection[]>([]);
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
  const [showInfoCard, setShowInfoCard] = useState(false);

  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg === 'new_reservation') {
      setShowInfoCard(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('msg');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

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
    spaces.forEach(s => { if (!grouped[s.section]) grouped[s.section] = []; grouped[s.section].push(s); });
    const sectionsArr = Object.keys(grouped).map(section => ({ section: parseInt(section), spaces: grouped[parseInt(section)], occupancyRate: (grouped[parseInt(section)].filter(s => s.status !== 'available').length / grouped[parseInt(section)].length) * 100 })).sort((a, b) => a.section - b.section);
    setSections(sectionsArr);
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

  const filteredSections = sections.map(s => ({ ...s, spaces: s.spaces.filter(applyFilters) })).filter(s => s.spaces.length > 0);
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
      toast({ variant: 'error', title: 'Erreur', description: result.error || 'Une erreur est survenue à la mise à jour de la réservation.' });
    }
  };

  const clearSelectedSpace = () => setSelectedSpace(null);
  const location = getStore().getLocations().find(l => l.id === selectedLocation)!;

  const showOccupancyBasedOnRange = dateRange.startDate !== null && dateRange.endDate !== null;
  let sectionsWithOccupancy = filteredSections;
  let spaceIdsWithReservationsInRange = new Set<string>();
  if (showOccupancyBasedOnRange) {
    spaceIdsWithReservationsInRange = new Set(filteredReservations.map(r => r.spaceId));
    sectionsWithOccupancy = filteredSections.map(section => {
      const totalSpaces = section.spaces.length;
      const reservedSpacesCount = section.spaces.filter(space => spaceIdsWithReservationsInRange.has(space.id)).length;
      const occupancyRate = totalSpaces === 0 ? 0 : (reservedSpacesCount / totalSpaces) * 100;
      return { ...section, occupancyRate };
    });
  }

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1 sm:space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Gestion du parking</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>Gérez les statuts et configurations des places</p>
      </div>

      {showInfoCard && (
        <div className="sticky top-16 z-10 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-blue-800 dark:text-blue-200 text-sm">Choisissez une place dans la grille pour ajouter une réservation.</p>
          </div>
          <button onClick={() => setShowInfoCard(false)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            sections={sectionsWithOccupancy}
            selectedSpaceId={selectedSpace?.id}
            onSelectSpace={setSelectedSpace}
            isAdmin
            adminSelectableStatuses={['available', 'maintenance']}
            showBlueRing={showOccupancyBasedOnRange}
            spaceIdsWithReservationsInRange={spaceIdsWithReservationsInRange}
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
            <Card className="p-6 text-center text-muted-foreground">Sélectionnez une place</Card>
          )}
        </div>
      </div>

      <ConfirmationModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} onConfirm={confirmStatusChange} title="Changer le statut" 
      message={`Êtes-vous sûr de vouloir mettre la place ${selectedSpace?.number} ${newStatus === 'maintenance' ? 'en maintenance' : 'disponible'} ?`} />

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
              userName={
                users.find(u => u.id === editingReservation.userId)
                  ? `${users.find(u => u.id === editingReservation.userId)?.firstName} ${users.find(u => u.id === editingReservation.userId)?.lastName}`
                  : ""
              }
              onSubmit={prepareEditReservation}
              onCancel={() => setShowEditReservationModal(false)}
            />
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={showConfirmReserveModal} onClose={() => setShowConfirmReserveModal(false)} onConfirm={editingReservation ? confirmEditReservation : confirmReserve} title={editingReservation ? 'Modifier la réservation' : 'Confirmer la réservation'}
      message={editingReservation ? `Modifier la réservation pour la place ${selectedSpace?.number} ?` : `Réserver la place ${selectedSpace?.number} au véhicule ${vehiclePlate} pour la période du: ${reservePayload?.start.toLocaleString('fr-FR')} - ${reservePayload?.end.toLocaleString('fr-FR')}?`} />
    </div>
  );
}

export default function ParkingManagementPage() { return <Suspense fallback={<Loading />}><ParkingManagementPageContent /></Suspense>; }