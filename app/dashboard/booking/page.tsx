'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { getStore } from '@/lib/store';
import { ParkingSpace, ParkingLevel } from '@/lib/types';
import { LoadingDots } from '@/components/loading-dots';
import Loading from './loading';

function BookingPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [levels, setLevels] = useState<ParkingLevel[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const store = getStore();
    const spaces = store.getSpaces();
    
    const groupedByLevel: Record<number, ParkingSpace[]> = {};
    spaces.forEach(space => {
      if (!groupedByLevel[space.level]) {
        groupedByLevel[space.level] = [];
      }
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

    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (selectedSpace && startDate && endDate) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours > 0) {
        const price = Math.round(hours * selectedSpace.pricePerHour * 100) / 100;
        setEstimatedPrice(price);
      } else {
        setEstimatedPrice(0);
      }
    }
  }, [selectedSpace, startDate, startTime, endDate, endTime]);

  const handleReserve = () => {
    setError('');

    if (!selectedSpace) {
      setError('Veuillez sélectionner une place');
      return;
    }

    if (!startDate || !endDate) {
      setError('Veuillez sélectionner les dates');
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (start >= end) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    setIsLoading(true);
    const store = getStore();
    const result = store.createReservation(user?.id || '', selectedSpace.id, start, end);

    if (result.success) {
      router.push('/dashboard/reservations');
    } else {
      setError(result.error || 'Réservation échouée');
    }
    setIsLoading(false);
  };

  const getSpaceStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      available: 'bg-secondary hover:bg-secondary/90 cursor-pointer',
      occupied: 'bg-destructive opacity-50 cursor-not-allowed',
      reserved: 'bg-primary opacity-50 cursor-not-allowed',
      maintenance: 'bg-muted opacity-50 cursor-not-allowed',
    };
    return statusColors[status] || 'bg-muted';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Réserver une place</h1>
        <p className="text-muted-foreground">Sélectionnez une place disponible et confirmez votre réservation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {levels.map(level => (
            <div key={level.level} className="card-base p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Niveau {level.level}</h2>
                <div className="text-sm text-muted-foreground">{Math.round(level.occupancyRate)}% occupé</div>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {level.spaces.map(space => (
                  <button
                    key={space.id}
                    onClick={() => space.status === 'available' && setSelectedSpace(space)}
                    disabled={space.status !== 'available'}
                    className={`aspect-square rounded-lg transition-all font-semibold text-sm text-white cursor-pointer ${getSpaceStatusColor(space.status)} ${
                      selectedSpace?.id === space.id ? 'ring-2 ring-accent ring-offset-2' : ''
                    }`}
                    title={`Place ${space.number} - ${space.type}`}
                  >
                    {space.number}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-xs pt-4 border-t border-border">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-secondary" /><span>Disponible</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-destructive opacity-50" /><span>Occupée</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary opacity-50" /><span>Réservée</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-muted opacity-50" /><span>Maintenance</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
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
                  <div className="flex flex-wrap gap-1">
                    {selectedSpace.features.map(feature => (
                      <span key={feature} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{feature}</span>
                    ))}
                  </div>
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
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Heure de début</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Date de fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="space-y-2">
              <label className="label-base">Heure de fin</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input-base w-full" disabled={!selectedSpace} />
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-sm text-muted-foreground">Estimation du tarif</p>
              <p className="text-3xl font-bold text-primary">{estimatedPrice.toFixed(2)} €</p>
            </div>
            {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}
            <button onClick={handleReserve} disabled={!selectedSpace || isLoading} className="btn-primary w-full cursor-pointer">
              {isLoading ? <LoadingDots /> : 'Confirmer la réservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {return <Suspense fallback={<Loading />}><BookingPageContent /></Suspense>};