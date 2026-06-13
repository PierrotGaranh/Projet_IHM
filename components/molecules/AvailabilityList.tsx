'use client';

import { useState } from 'react';
import { Reservation, ParkingSpace } from '@/lib/types';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/atoms/Button';
import { Edit, Info, Trash } from 'lucide-react';

interface AvailabilityListProps {
  reservations: Reservation[];
  spacesMap: Record<string, ParkingSpace>;
  onEdit?: (reservation: Reservation) => void;
  onCancel?: (id: string) => void;
  limit?: number;
  dateRange?: { startDate: Date | null; endDate: Date | null };
}

export function AvailabilityList({ reservations, spacesMap, onEdit, onCancel, limit = 5, dateRange }: AvailabilityListProps) {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reservations : reservations.slice(0, limit);

  const isDateRangeActive = dateRange?.startDate && dateRange?.endDate;

  if (!isDateRangeActive) {
    return (
      <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1">
        <Info className="w-5 h-5" />
        Veuillez d'abord sélectionner une période dans les filtres. La liste qui suivra va montrer
        les réservations prévues sur la période sélectionnée.
      </div>
    );
  }

  if (reservations.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune réservation prévue sur la place pour la période sélectionnée</p>;
  }

  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR');
  const formatTime = (date: Date) => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const canEditCancel = (reservation: Reservation) => {
    if (!onEdit || !onCancel) return false;
    if (reservation.status !== 'active') return false;
    if (!user) return false;
    return user.role === 'admin' || reservation.userId === user.id;
  };

  return (
    <div className="space-y-3">
      {displayed.map(res => {
        const space = spacesMap[res.spaceId];
        return (
          <div key={res.id} className="p-3 bg-muted/30 rounded-lg text-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">Place {space?.number || '?'}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-right">
                    <div className="text-xs font-mono">{formatDate(res.startDate)}</div>
                    <div className="text-xs font-mono">{formatTime(res.startDate)}</div>
                  </div>
                  <div className="text-muted-foreground text-lg">→</div>
                  <div>
                    <div className="text-xs font-mono">{formatDate(res.endDate)}</div>
                    <div className="text-xs font-mono">{formatTime(res.endDate)}</div>
                  </div>
                </div>
                <p className="text-xs mt-1">Véhicule: {res.vehiclePlate}</p>
              </div>
              {canEditCancel(res) && (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onEdit!(res)}><Edit className="w-3 h-3" /></Button>
                  <Button variant="secondary" onClick={() => onCancel!(res.id)}><Trash className="w-3 h-3" /></Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {reservations.length > limit && !showAll && (
        <Button variant="ghost" className="text-xs" onClick={() => setShowAll(true)}>
          Afficher plus ({reservations.length - limit})
        </Button>
      )}
    </div>
  );
}