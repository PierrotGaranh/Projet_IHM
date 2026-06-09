'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel, Reservation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ParkingGrid } from '@/components/organisms/ParkingGrid';
import { FilterSection } from '@/components/organisms/FilterSection';
import { ReserveSpaceForm } from '@/components/organisms/ReserveSpaceForm';
import { ParkingSpaceDetail } from '@/components/organisms/ParkingSpaceDetail';
import Loading from './loading';

function BookingPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [error, setError] = useState('');
  const [editingReservationId, setEditingReservationId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [filterType, setFilterType] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [filterFeature, setFilterFeature] = useState<Record<string, 'neutral' | 'selected' | 'deselected'>>({});
  const [selectedLocation, setSelectedLocation] = useState<string>('loc1');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [spacesMap, setSpacesMap] = useState<Record<string, ParkingSpace>>({});
  const formRef = useRef<HTMLDivElement>(null);

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

  const fetchData = () => {
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
  };

  useEffect(() => { fetchData(); }, [selectedLocation]);

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

  const handleSelectSpace = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setEditingReservationId(null);
    if (formRef.current) smoothScrollToElement(formRef.current);
  };

  const handleEditReservation = (space: ParkingSpace) => {
    const store = getStore();
    const reservation = store.getUserReservations(user?.id || '').find(r => r.spaceId === space.id && r.status === 'active');
    if (reservation) {
      setSelectedSpace(space);
      setEditingReservationId(reservation.id);
      if (formRef.current) smoothScrollToElement(formRef.current);
    }
  };

  const handleCancelMyReservation = (space: ParkingSpace) => {
    const store = getStore();
    const reservation = store.getUserReservations(user?.id || '').find(r => r.spaceId === space.id && r.status === 'active');
    if (reservation) { setCancelReservationId(reservation.id); setShowCancelModal(true); }
  };

  const confirmCancel = () => {
    if (cancelReservationId) { const store = getStore(); store.cancelReservation(cancelReservationId); toast({ variant: 'success', title: 'Réservation annulée', description: 'Votre réservation a été annulée avec succès.' }); setShowCancelModal(false); fetchData(); }
  };

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
  const store = getStore();
  const userReservations = store.getUserReservations(user?.id || '').filter(r => r.status === 'active');
  const userReservedSpaceIds = new Set(userReservations.map(r => r.spaceId));
  const userPlates = user?.vehiclePlates || [];

  const clearSelectedSpace = () => setSelectedSpace(null);

  const handleReserveSubmit = async (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => {
    if (editingReservationId) {
      store.cancelReservation(editingReservationId);
      const result = store.createReservation(user?.id || '', selectedSpace!.id, data.startDate, data.endDate, data.vehiclePlate);
      if (result.success) {
        toast({ variant: 'success', title: 'Réservation modifiée', description: `Place ${selectedSpace!.number} réservée du ${data.startDate.toLocaleDateString('fr-FR')} au ${data.endDate.toLocaleDateString('fr-FR')}` });
        setEditingReservationId(null);
        router.push('/reservations');
      } else setError(result.error || 'Erreur lors de la modification');
    } else {
      const result = store.createReservation(user?.id || '', selectedSpace!.id, data.startDate, data.endDate, data.vehiclePlate);
      if (result.success) {
        toast({ variant: 'success', title: 'Réservation confirmée', description: `Place ${selectedSpace!.number} réservée du ${data.startDate.toLocaleDateString('fr-FR')} au ${data.endDate.toLocaleDateString('fr-FR')}` });
        router.push('/reservations');
      } else setError(result.error || 'Réservation échouée');
    }
  };

  const initialData = editingReservationId ? (() => {
    const res = store.getReservation(editingReservationId);
    if (res) return { startDate: res.startDate, endDate: res.endDate, vehiclePlate: res.vehiclePlate };
    return undefined;
  })() : undefined;

  const location = getStore().getLocations().find(l => l.id === selectedLocation)!;

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="space-y-2"><h1 className="text-3xl font-bold">Réserver une place</h1><p className="text-muted-foreground">Sélectionnez une place disponible et confirmez votre réservation</p></div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ParkingGrid
            levels={filteredLevels}
            selectedSpaceId={selectedSpace?.id}
            onSelectSpace={handleSelectSpace}
            userReservedSpaceIds={userReservedSpaceIds}
            onEditReservation={handleEditReservation}
            onCancelReservation={handleCancelMyReservation}
          />
        </div>
        <div className="space-y-4" ref={formRef}>
          {selectedSpace ? (
            <>
              <ParkingSpaceDetail
                space={selectedSpace}
                location={{ address: location.address, lat: location.lat, lng: location.lng }}
                reservations={filteredReservations.filter(r => r.spaceId === selectedSpace.id)}
                spacesMap={spacesMap}
                onClear={clearSelectedSpace}
                onEditReservation={(res) => {
                  setEditingReservationId(res.id);
                  setSelectedSpace(store.getSpace(res.spaceId)!);
                }}
                onCancelReservation={(id) => {
                  store.cancelReservation(id);
                  fetchData();
                  toast({ variant: 'success', title: 'Réservation annulée' });
                }}
                dateRange={dateRange}
              />
              <div className="card-base p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Détails de réservation</h3>
                <ReserveSpaceForm
                  spaceId={selectedSpace.id}
                  pricePerHour={selectedSpace.pricePerHour}
                  userPlates={userPlates}
                  onSubmit={handleReserveSubmit}
                  initialData={initialData}
                  isEditing={!!editingReservationId}
                />
                {error && <div className="text-sm text-destructive">{error}</div>}
              </div>
            </>
          ) : (
            <div className="card-base p-4 text-center text-muted-foreground">Sélectionnez une place dans la grille</div>
          )}
        </div>
      </div>
      <ConfirmationModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={confirmCancel} title="Annuler la réservation" message="Êtes-vous sûr de vouloir annuler cette réservation ?" />
    </div>
  );
}

export default function BookingPage() { return <Suspense fallback={<Loading />}><BookingPageContent /></Suspense>; }