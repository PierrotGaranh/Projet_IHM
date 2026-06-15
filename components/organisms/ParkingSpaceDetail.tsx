import { ParkingSpace, Reservation } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';
import { LocationMap } from '@/components/molecules/LocationMap';
import { AvailabilityList } from '@/components/molecules/AvailabilityList';

interface ParkingSpaceDetailProps {
  space: ParkingSpace;
  location: { address: string; lat: number; lng: number };
  reservations: Reservation[];
  spacesMap: Record<string, ParkingSpace>;
  onClear: () => void;
  onEditReservation?: (reservation: Reservation) => void;
  onCancelReservation?: (id: string) => void;
  dateRange?: { startDate: Date | null; endDate: Date | null };
}

export function ParkingSpaceDetail({ space, location, reservations, spacesMap, onClear, onEditReservation, onCancelReservation, dateRange }: ParkingSpaceDetailProps) {
  const typeLabels: Record<string, string> = { compact: 'Compact', standard: 'Standard', premium: 'Premium' };
  const featureLabels: Record<string, string> = { handicap: 'Handicapé', chargeur: 'Chargeur électrique', surveillée: 'Surveillée', sécurisée: 'Sécurisée' };

  return (
    <Card className="p-4 bg-secondary/5 border-2 border-secondary space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-foreground text-lg">Détails de la place</h3>
          <p className="text-2xl font-bold">{space.number}</p>
        </div>
        <Button variant="ghost" onClick={onClear}><X className="w-4 h-4" /></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><p className="text-muted-foreground text-sm">Section</p><p className="font-semibold">{space.section}</p></div>
          <div><p className="text-muted-foreground text-sm">Type</p><p className="font-semibold capitalize">{typeLabels[space.type]}</p></div>
          <div><p className="text-muted-foreground text-sm">Prix/heure</p><p className="font-semibold">{space.pricePerHour}€</p></div>
          {space.features.length > 0 && (
            <div>
              <p className="text-muted-foreground text-sm">Équipements</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {space.features.map(f => <span key={f} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{featureLabels[f]}</span>)}
              </div>
            </div>
          )}
        </div>

        <LocationMap lat={location.lat} lng={location.lng} address={location.address} />
      </div>

      <div className="pt-4 border-t border-border">
        <h4 className="font-medium mb-3">Réservations sur cette place</h4>
        <AvailabilityList
          reservations={reservations}
          spacesMap={spacesMap}
          onEdit={onEditReservation}
          onCancel={onCancelReservation}
          dateRange={dateRange}
        />
      </div>
    </Card>
  );
}