'use client';

import { ParkingSpace, Reservation } from '@/lib/types';
import { getStore } from '@/lib/store';
import { useEffect, useState } from 'react';

interface AvailabilityTooltipProps {
  space: ParkingSpace;
  filterStart?: Date | null;
  filterEnd?: Date | null;
}

export function AvailabilityTooltip({ space, filterStart, filterEnd }: AvailabilityTooltipProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = getStore();
    let allRes = store.getReservations().filter(r => r.spaceId === space.id && r.status === 'active');
    if (filterStart && filterEnd) {
      allRes = allRes.filter(r => r.startDate >= filterStart && r.endDate <= filterEnd);
    }
    const sorted = [...allRes].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    setReservations(sorted.slice(0, 5));
    setLoading(false);
  }, [space.id, filterStart, filterEnd]);

  if (loading) return <div className="w-48 h-12 animate-pulse bg-muted rounded" />;

  if (!filterStart || !filterEnd) return null;

  return (
    <div className="w-56 p-2 bg-popover text-popover-foreground rounded-md shadow-lg border border-border">
      <div className="text-xs font-semibold mb-2 text-center">Réservations dans la période</div>
      {reservations.length === 0 ? (
        <div className="text-xs text-center">Aucune réservation</div>
      ) : (
        <div className="space-y-2">
          {reservations.map(r => (
            <div key={r.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>{r.startDate.toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="font-mono">
                {r.startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} →{' '}
                {r.endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}