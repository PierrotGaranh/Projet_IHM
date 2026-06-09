'use client';

import { useState } from 'react';
import { Reservation, ParkingSpace } from '@/lib/types';
import { Button } from '@/components/atoms/Button';

interface AvailabilityListProps {
  reservations: Reservation[];
  spacesMap: Record<string, ParkingSpace>;
  onEdit?: (reservation: Reservation) => void;
  onCancel?: (id: string) => void;
  limit?: number;
  dateRange?: { startDate: Date | null; endDate: Date | null };
}

export function AvailabilityList({ reservations, spacesMap, onEdit, onCancel, limit = 5, dateRange }: AvailabilityListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reservations : reservations.slice(0, limit);

  const isDateRangeActive = dateRange?.startDate && dateRange?.endDate;

  if (!isDateRangeActive) {
    return <p className="text-sm text-muted-foreground">Veuillez sélectionner une période dans les filtres pour voir les réservations</p>;
  }

  if (reservations.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune réservation prévue sur la place pour la période sélectionnée</p>;
  }

  return (
    <div className="space-y-3">
      {displayed.map(res => {
        const space = spacesMap[res.spaceId];
        return (
          <div key={res.id} className="p-3 bg-muted/30 rounded-lg text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Place {space?.number || '?'}</p>
                <p className="text-xs text-muted-foreground">
                  {res.startDate.toLocaleString('fr-FR')} → {res.endDate.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs">Véhicule: {res.vehiclePlate}</p>
              </div>
              {onEdit && onCancel && res.status === 'active' && (
                <div className="flex gap-2">
                  <Button variant="secondary" className="text-xs" onClick={() => onEdit(res)}>Modifier</Button>
                  <Button variant="secondary" className="text-xs" onClick={() => onCancel(res.id)}>Annuler</Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {reservations.length > limit && !showAll && (
        <Button variant="ghost" className="text-xs" onClick={() => setShowAll(true)}>Afficher plus ({reservations.length - limit})</Button>
      )}
    </div>
  );
}