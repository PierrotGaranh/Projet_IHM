'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { ParkingGrid } from '@/components/parking-grid';
import { FilterSection } from '@/components/filter-section';
import { VehiclePlateInput } from '@/components/vehicle-plate-input';
import Loading from './loading';
import { CarFront, Crown, Minimize2, X } from 'lucide-react';

function BookingPageContent() {
  const router = useRouter();
  const { user, addVehiclePlate } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingReservationId, setEditingReservationId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  const [selectedPlate, setSelectedPlate] = useState('');
  const [otherPlate, setOtherPlate] = useState('');
  const [showConfirmReserveModal, setShowConfirmReserveModal] = useState(false);
  const [reservePayload, setReservePayload] = useState<any>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const smoothScrollToElement = (element: HTMLElement, offset = 80) => {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
  };

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
    surveillée: 'Surveillée',
    sécurisée: 'Sécurisée'
  };

  const allStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
  const allTypes = ['compact', 'standard', 'premium'];
  const allFeatures = ['handicap', 'chargeur', 'surveillée', 'sécurisée'];

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
        occupancyRate: (groupedByLevel[parseInt(level)].filter(s => s.status !== 'available').length / groupedByLevel[parseInt(level)].length) * 100,
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
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    const saved = sessionStorage.getItem('bookingForm');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStartDate(parsed.startDate || today);
      setStartTime(parsed.startTime || '09:00');
      setEndDate(parsed.endDate || today);
      setEndTime(parsed.endTime || '17:00');
      setSelectedPlate(parsed.selectedPlate || '');
      setOtherPlate(parsed.otherPlate || '');
    }
  }, []);

  useEffect(() => {
    if (selectedSpace && formRef.current) {
      smoothScrollToElement(formRef.current);
    }
  }, [selectedSpace]);

  useEffect(() => {
    if (selectedSpace && startDate && endDate) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours > 0) {
        setEstimatedPrice(Math.round(hours * selectedSpace.pricePerHour * 100) / 100);
      } else {
        setEstimatedPrice(0);
      }
    }
  }, [selectedSpace, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    sessionStorage.setItem('bookingForm', JSON.stringify({ startDate, startTime, endDate, endTime, selectedPlate, otherPlate }));
  }, [startDate, startTime, endDate, endTime, selectedPlate, otherPlate]);

  if (loading) return <Loading />;

  const handleEditReservation = (space: ParkingSpace) => {
    const store = getStore();
    const reservation = store.getUserReservations(user?.id || '').find(r => r.spaceId === space.id && r.status === 'active');
    if (reservation) {
      setSelectedSpace(space);
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0,5));
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0,5));
      setEditingReservationId(reservation.id);
      setSelectedPlate(reservation.vehiclePlate);
      if (formRef.current) {
        smoothScrollToElement(formRef.current);
      }
    }
  };

  const prepareReserveOrUpdate = () => {
    setError('');
    if (!selectedSpace) { setError('Veuillez sélectionner une place'); return; }
    if (!startDate || !endDate) { setError('Veuillez sélectionner les dates'); return; }
    let finalPlate = '';
    if (selectedPlate === 'other') {
      if (!otherPlate.trim()) { setError('Veuillez saisir une plaque'); return; }
      finalPlate = otherPlate.trim();
      if (user && !user.vehiclePlates.includes(finalPlate)) addVehiclePlate(finalPlate);
    } else if (selectedPlate) { finalPlate = selectedPlate; }
    else { setError('Veuillez renseigner la plaque du véhicule'); return; }
    if (!/^[A-Za-z0-9\s-]{1,15}$/.test(finalPlate)) { setError('Plaque invalide (lettres, chiffres, -, espace)'); return; }
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    if (start < now) { setError('La date de début doit être aujourd\'hui ou ultérieure'); return; }
    if (start >= end) { setError('La date de fin doit être antérieure à la date de début'); return; }
    setReservePayload({ start, end, finalPlate });
    setShowConfirmReserveModal(true);
  };

  const handleReserveOrUpdate = async () => {
    if (!reservePayload) return;
    const { start, end, finalPlate } = reservePayload;
    setIsLoading(true);
    const store = getStore();
    if (editingReservationId) {
      store.cancelReservation(editingReservationId);
      const result = store.createReservation(user?.id || '', selectedSpace!.id, start, end, finalPlate);
      if (result.success) {
        toast({ variant: 'success', title: 'Réservation modifiée', description: `Place ${selectedSpace!.number} réservée du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}` });
        setEditingReservationId(null);
        router.push('/dashboard/reservations');
      } else setError(result.error || 'Erreur lors de la modification');
    } else {
      const result = store.createReservation(user?.id || '', selectedSpace!.id, start, end, finalPlate);
      if (result.success) {
        toast({ variant: 'success', title: 'Réservation confirmée', description: `Place ${selectedSpace!.number} réservée du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}` });
        router.push('/dashboard/reservations');
      } else setError(result.error || 'Réservation échouée');
    }
    setIsLoading(false);
    setShowConfirmReserveModal(false);
  };

  const handleCancelMyReservation = (space: ParkingSpace) => {
    const store = getStore();
    const reservation = store.getUserReservations(user?.id || '').find(r => r.spaceId === space.id && r.status === 'active');
    if (reservation) {
      setCancelReservationId(reservation.id);
      setShowCancelModal(true);
    }
  };

  const confirmCancel = () => {
    if (cancelReservationId) {
      const store = getStore();
      store.cancelReservation(cancelReservationId);
      toast({ variant: 'success', title: 'Réservation annulée', description: 'Votre réservation a été annulée avec succès.' });
      setShowCancelModal(false);
      fetchData();
    }
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

  const store = getStore();
  const userReservations = store.getUserReservations(user?.id || '').filter(r => r.status === 'active');
  const userReservedSpaceIds = new Set(userReservations.map(r => r.spaceId));
  const userPlates = user?.vehiclePlates || [];

  const clearSelectedSpace = () => setSelectedSpace(null);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Réserver une place</h1>
        <p className="text-muted-foreground">Sélectionnez une place disponible et confirmez votre réservation</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ParkingGrid levels={filteredLevels} selectedSpaceId={selectedSpace?.id} onSelectSpace={setSelectedSpace} userReservedSpaceIds={userReservedSpaceIds} onEditReservation={handleEditReservation} onCancelReservation={handleCancelMyReservation} />
        </div>

        <div className="space-y-4" ref={formRef}>
          <div className="space-y-4">
            {selectedSpace ? (
              <div className="card-base p-4 bg-secondary/5 border-2 border-secondary space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Place sélectionnée</p>
                    <p className="text-2xl font-bold text-foreground">{selectedSpace.number}</p>
                  </div>
                  <button onClick={clearSelectedSpace} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Niveau</span><span className="font-semibold">{selectedSpace.level}</span></div>
                  <div className="flex justify-between"><span>Type</span><span className="font-semibold capitalize">{typeLabels[selectedSpace.type]}</span></div>
                  <div className="flex justify-between"><span>Prix/heure</span><span className="font-semibold">{selectedSpace.pricePerHour} €</span></div>
                </div>
                {selectedSpace.features.length > 0 && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold">Équipements</p>
                    <div className="flex flex-wrap gap-1">{selectedSpace.features.map(feature => <span key={feature} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{featureLabels[feature]}</span>)}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-base p-4 text-center text-muted-foreground space-y-2"><p>Sélectionnez une place</p><p className="text-xs">dans la grille ci-contre</p></div>
            )}

            <div className="card-base p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Détails de réservation</h3>
              <div><label className="label-base">Date de début</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" disabled={!selectedSpace} /></div>
              <div><label className="label-base">Heure de début</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input-base w-full" disabled={!selectedSpace} /></div>
              <div><label className="label-base">Date de fin</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} className="input-base w-full" disabled={!selectedSpace} /></div>
              <div><label className="label-base">Heure de fin</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input-base w-full" disabled={!selectedSpace} /></div>
              <VehiclePlateInput 
                value={selectedPlate}
                onChange={setSelectedPlate}
                options={userPlates}
                label="Plaque du véhicule"
              />
              <div className="pt-4 border-t border-border"><p className="text-sm text-muted-foreground">Estimation du tarif</p><p className="text-3xl font-bold text-primary">{estimatedPrice.toFixed(2)} €</p></div>
              {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}
              <button onClick={prepareReserveOrUpdate} disabled={!selectedSpace || isLoading} className="btn-primary w-full cursor-pointer">{isLoading ? <LoadingDots /> : (editingReservationId ? 'Modifier la réservation' : 'Confirmer la réservation')}</button>
            </div>
          </div>
        </div>
      </div>

      {user?.role !== 'admin' && (
        <div className="card-base p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors rounded-lg sm:rounded-none">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Minimize2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">Compact</span>
                  <span className="text-base font-bold text-foreground">2€<span className="text-xs font-normal text-muted-foreground">/h</span></span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Idéale pour les petits véhicules</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors rounded-lg sm:rounded-none">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <CarFront className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">Standard</span>
                  <span className="text-base font-bold text-foreground">3€<span className="text-xs font-normal text-muted-foreground">/h</span></span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Bon équilibre entre la place et le prix</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 transition-colors rounded-lg sm:rounded-none">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">Premium</span>
                    <span className="text-[10px] font-bold bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">Recommandé</span>
                  </div>
                  <span className="text-base font-bold text-yellow-600 dark:text-yellow-400">5€<span className="text-xs font-normal text-muted-foreground">/h</span></span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Recharge incluse - Sécurité renforcée - Place surveillée</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)} 
        onConfirm={confirmCancel} 
        title="Annuler la réservation"
        message={"Êtes-vous sûr de vouloir annuler cette réservation ?"}
      >
        <div className="space-y-4">
          {cancelReservationId && (() => {
            const res = store.getReservation(cancelReservationId);
            const space = res ? store.getSpace(res.spaceId) : null;
            return (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2"><span className="font-semibold">Place :</span> {space?.number || 'N/A'}</div>
                <div className="flex items-center gap-2"><span className="font-semibold">Début :</span> {res?.startDate.toLocaleString('fr-FR')}</div>
                <div className="flex items-center gap-2"><span className="font-semibold">Fin :</span> {res?.endDate.toLocaleString('fr-FR')}</div>
              </div>
            );
          })()}
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showConfirmReserveModal}
        onClose={() => setShowConfirmReserveModal(false)}
        onConfirm={handleReserveOrUpdate}
        title={editingReservationId ? "Modifier la réservation" : "Confirmer la réservation"}
        message={editingReservationId 
          ? `Êtes-vous sûr de vouloir modifier la réservation pour la place ${selectedSpace?.number} ?`
          : `Êtes-vous sûr de vouloir réserver la place ${selectedSpace?.number} ?`
        }
      >
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2"><span className="font-semibold">Début :</span> {reservePayload?.start.toLocaleString('fr-FR')}</div>
            <div className="flex items-center gap-2"><span className="font-semibold">Fin :</span> {reservePayload?.end.toLocaleString('fr-FR')}</div>
            <div className="flex items-center gap-2"><span className="font-semibold">Plaque :</span> {reservePayload?.finalPlate}</div>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default function BookingPage() {
  return <Suspense fallback={<Loading />}><BookingPageContent /></Suspense>;
}