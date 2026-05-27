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
import Loading from './loading';

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
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const store = getStore();
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
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (selectedSpace && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReserveOrUpdate = async () => {
    setError('');
    if (!selectedSpace) {
      setError('Veuillez sélectionner une place');
      return;
    }
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner les dates');
      return;
    }
    let finalPlate = '';
    if (selectedPlate === 'other') {
      if (!otherPlate.trim()) {
        setError('Veuillez saisir une plaque');
        return;
      }
      finalPlate = otherPlate.trim();
      if (user && !user.vehiclePlates.includes(finalPlate)) {
        addVehiclePlate(finalPlate);
      }
    } else if (selectedPlate) {
      finalPlate = selectedPlate;
    } else {
      setError('Veuillez renseigner la plaque du véhicule');
      return;
    }
    if (!/^[A-Za-z0-9\s-]{1,15}$/.test(finalPlate)) {
      setError('Plaque invalide (lettres, chiffres, -, espace)');
      return;
    }
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    if (start < now) {
      setError('La date de début doit être aujourd\'hui ou ultérieure');
      return;
    }
    if (start >= end) {
      setError('La date de fin doit être antérieure à la date de début');
      return;
    }
    setIsLoading(true);
    const store = getStore();
    if (editingReservationId) {
      store.cancelReservation(editingReservationId);
      const result = store.createReservation(user?.id || '', selectedSpace.id, start, end, finalPlate);
      if (result.success) {
        toast({ variant: 'success', title: 'Réservation modifiée', description: `Place ${selectedSpace.number} réservée du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}` });
        setEditingReservationId(null);
        router.push('/dashboard/reservations');
      } else {
        setError(result.error || 'Erreur lors de la modification');
      }
    } else {
      const result = store.createReservation(user?.id || '', selectedSpace.id, start, end, finalPlate);
      if (result.success) {
        toast({ variant: 'success', title: 'Réservation confirmée', description: `Place ${selectedSpace.number} réservée du ${start.toLocaleDateString('fr-FR')} au ${end.toLocaleDateString('fr-FR')}` });
        router.push('/dashboard/reservations');
      } else {
        setError(result.error || 'Réservation échouée');
      }
    }
    setIsLoading(false);
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
      window.location.reload();
    }
  };

  const store = getStore();
  const userReservations = store.getUserReservations(user?.id || '').filter(r => r.status === 'active');
  const userReservedSpaceIds = new Set(userReservations.map(r => r.spaceId));
  const userPlates = user?.vehiclePlates || [];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Réserver une place</h1>
        <p className="text-muted-foreground">Sélectionnez une place disponible et confirmez votre réservation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ParkingGrid levels={levels} selectedSpaceId={selectedSpace?.id} onSelectSpace={setSelectedSpace} userReservedSpaceIds={userReservedSpaceIds} onEditReservation={handleEditReservation} onCancelReservation={handleCancelMyReservation} />
        </div>

        <div className="space-y-4" ref={formRef}>
          {selectedSpace ? (
            <div className="card-base p-4 bg-secondary/5 border-2 border-secondary space-y-3">
              <p className="text-sm text-muted-foreground">Place sélectionnée</p>
              <p className="text-2xl font-bold text-foreground">{selectedSpace.number}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Niveau</span><span className="font-semibold">{selectedSpace.level}</span></div>
                <div className="flex justify-between"><span>Type</span><span className="font-semibold capitalize">{selectedSpace.type}</span></div>
                <div className="flex justify-between"><span>Prix/heure</span><span className="font-semibold">{selectedSpace.pricePerHour} €</span></div>
              </div>
              {selectedSpace.features.length > 0 && (
                <div className="pt-3 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Équipements</p>
                  <div className="flex flex-wrap gap-1">{selectedSpace.features.map(feature => <span key={feature} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{feature}</span>)}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="card-base p-4 text-center text-muted-foreground space-y-2">
              <p>Sélectionnez une place</p>
              <p className="text-xs">dans la grille ci-contre</p>
            </div>
          )}

          <div className="card-base p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Détails de réservation</h3>
            <div className="space-y-2">
              <label className="label-base">Date de début</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Heure de début</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Date de fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Heure de fin</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Plaque d'immatriculation *</label>
              <select value={selectedPlate} onChange={(e) => setSelectedPlate(e.target.value)} className="input-base w-full" disabled={!selectedSpace}>
                <option value="">Sélectionnez une plaque</option>
                {userPlates.map((plate, idx) => <option key={idx} value={plate}>{plate}</option>)}
                <option value="other">Autre (saisir manuellement)</option>
              </select>
              {selectedPlate === 'other' && (
                <input type="text" value={otherPlate} onChange={(e) => setOtherPlate(e.target.value.slice(0,15))} placeholder="Nouvelle plaque" className="input-base w-full mt-2" />
              )}
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-sm text-muted-foreground">Estimation du tarif</p>
              <p className="text-3xl font-bold text-primary">{estimatedPrice.toFixed(2)} €</p>
            </div>
            {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive" role="alert">{error}</div>}
            <button onClick={handleReserveOrUpdate} disabled={!selectedSpace || isLoading} className="btn-primary w-full cursor-pointer">{isLoading ? <LoadingDots /> : (editingReservationId ? 'Modifier la réservation' : 'Confirmer la réservation')}</button>
          </div>
        </div>
      </div>

      <ConfirmationModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={confirmCancel} title="Annuler la réservation" message="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible." />
    </div>
  );
}

export default function BookingPage() {
  return <Suspense fallback={<Loading />}><BookingPageContent /></Suspense>;
}