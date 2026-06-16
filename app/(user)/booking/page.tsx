'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingSection, Reservation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/atoms/Card';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ParkingGrid } from '@/components/organisms/ParkingGrid';
import { FilterSection } from '@/components/organisms/ParkingFilterSection';
import { ReserveSpaceForm } from '@/components/organisms/ReserveSpaceForm';
import { ParkingSpaceDetail } from '@/components/organisms/ParkingSpaceDetail';
import { useIsMobile } from '@/hooks/use-mobile';
import Loading from './loading';
import { MousePointerClick } from 'lucide-react';

function BookingPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<ParkingSection[]>([]);
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
  const [showForm, setShowForm] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
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
    spaces.forEach(s => { if (!grouped[s.section]) grouped[s.section] = []; grouped[s.section].push(s); });
    const sectionsArr = Object.keys(grouped).map(section => ({ section: parseInt(section), spaces: grouped[parseInt(section)], occupancyRate: (grouped[parseInt(section)].filter(s => s.status !== 'available').length / grouped[parseInt(section)].length) * 100 })).sort((a, b) => a.section - b.section);
    setSections(sectionsArr);
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

  useEffect(() => {
    if (showForm && formContainerRef.current) {
      smoothScrollToElement(formContainerRef.current);
    }
  }, [showForm]);

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
  const store = getStore();
  const userReservations = store.getUserReservations(user?.id || '').filter(r => r.status === 'active');
  const userReservedSpaceIds = new Set(userReservations.map(r => r.spaceId));
  const userPlates = user?.vehiclePlates || [];

  const clearSelectedSpace = () => {
    setSelectedSpace(null);
    setShowForm(false);
  };

  const handleSelectSpace = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setEditingReservationId(null);
    setShowForm(false);
    if (formRef.current) smoothScrollToElement(formRef.current);
  };

  const handleTakeReservation = () => {
    setShowForm(true);
  };

  const handleEditReservation = (space: ParkingSpace) => {
    const store = getStore();
    const reservation = store.getUserReservations(user?.id || '').find(r => r.spaceId === space.id && r.status === 'active');
    if (reservation) {
      setSelectedSpace(space);
      setEditingReservationId(reservation.id);
      setShowForm(true);
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

  const handleReserveSubmit = async (data: { startDate: Date; endDate: Date; vehiclePlate: string }) => {
    try {
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
    } catch (err) {
      toast({ variant: 'error', title: 'Erreur', description: err instanceof Error ? err.message : 'Une erreur est survenue' });
    }
  };

  const initialData = editingReservationId ? (() => {
    const res = store.getReservation(editingReservationId);
    if (res) return { startDate: res.startDate, endDate: res.endDate, vehiclePlate: res.vehiclePlate };
    return undefined;
  })() : undefined;

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

  const canReserve = selectedSpace && selectedSpace.status === 'available' && !userReservedSpaceIds.has(selectedSpace.id);

  if (loading) return <Loading />;

  const headingClass = isMobile ? 'text-2xl' : 'text-3xl';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1 sm:space-y-2">
        <h1 className={`${headingClass} font-bold`}>Réserver une place</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>Sélectionnez une place disponible et confirmez votre réservation</p>
      </div>
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
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <ParkingGrid
            sections={sectionsWithOccupancy}
            selectedSpaceId={selectedSpace?.id}
            onSelectSpace={handleSelectSpace}
            userReservedSpaceIds={userReservedSpaceIds}
            onEditReservation={handleEditReservation}
            onCancelReservation={handleCancelMyReservation}
            showReserved={showOccupancyBasedOnRange}
            spaceIdsWithReservationsInRange={spaceIdsWithReservationsInRange}
          />
        </div>
        <div className="lg:w-1/3 space-y-4" ref={formRef}>
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
                  setShowForm(true);
                }}
                onCancelReservation={(id) => {
                  store.cancelReservation(id);
                  fetchData();
                  toast({ variant: 'success', title: 'Réservation annulée' });
                }}
                dateRange={dateRange}
                showTakeReservationButton={!showForm && !!canReserve}
                onTakeReservation={handleTakeReservation}
              />
              {selectedSpace && showForm && (
                <div ref={formContainerRef} className="block">
                  <Card className={`${isMobile ? 'p-5' : 'p-6'} space-y-4`}>
                    <ReserveSpaceForm
                      spaceId={selectedSpace.id}
                      pricePerHour={selectedSpace.pricePerHour}
                      userPlates={userPlates}
                      onSubmit={handleReserveSubmit}
                      initialData={initialData}
                      isEditing={!!editingReservationId}
                      onClose={() => setShowForm(false)}
                    />
                    {error && <div className="text-sm text-destructive">{error}</div>}
                  </Card>
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 text-center text-muted-foreground border-2 border-dashed border-primary/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Aucune place sélectionnée</p>
                <p className="text-sm">Cliquez sur une place <span className="inline-block w-3 h-3 rounded-full bg-green-500 align-middle"></span> <strong>disponible</strong> pour commencer votre réservation</p>
                <div className="mt-2 text-xs text-primary/70">Sélectionnez une place dans la grille</div>
              </div>
            </Card>
          )}
        </div>
      </div>
      <ConfirmationModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={confirmCancel} title="Annuler la réservation" message="Êtes-vous sûr de vouloir annuler cette réservation ?" isDangerous={true}/>
    </div>
  );
}

export default function BookingPage() { return <Suspense fallback={<Loading />}><BookingPageContent /></Suspense>; }