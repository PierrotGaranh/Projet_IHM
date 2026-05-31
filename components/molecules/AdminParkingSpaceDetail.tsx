import { ParkingSpace } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';

interface AdminParkingSpaceDetailProps {
  space: ParkingSpace;
  onClear: () => void;
  onReserveForUser: () => void;
  onEditReservation: () => void;
  onMaintenance: () => void;
  onRemoveMaintenance: () => void;
}

const typeLabels: Record<string, string> = { compact: 'Compact', standard: 'Standard', premium: 'Premium' };
const featureLabels: Record<string, string> = { handicap: 'Handicapé', chargeur: 'Chargeur électrique', surveillée: 'Surveillée', sécurisée: 'Sécurisée' };

export function AdminParkingSpaceDetail({
  space,
  onClear,
  onReserveForUser,
  onEditReservation,
  onMaintenance,
  onRemoveMaintenance,
}: AdminParkingSpaceDetailProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-foreground text-lg">Détails de la place</h3>
        <Button variant="ghost"onClick={onClear} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></Button>
      </div>
      <div className="space-y-3 text-sm">
        <div><p className="text-muted-foreground">Numéro</p><p className="font-semibold text-foreground text-lg">{space.number}</p></div>
        <div><p className="text-muted-foreground">Niveau</p><p className="font-semibold text-foreground">{space.level}</p></div>
        <div><p className="text-muted-foreground">Type</p><p className="font-semibold text-foreground capitalize">{typeLabels[space.type]}</p></div>
        <div><p className="text-muted-foreground">Prix/heure</p><p className="font-semibold text-foreground">{space.pricePerHour}€</p></div>
        <div className="pt-3 border-t border-border">
          <p className="text-muted-foreground text-xs font-semibold">ÉQUIPEMENTS</p>
          {space.features.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {space.features.map(f => <span key={f} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{featureLabels[f]}</span>)}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Aucun équipement</p>
          )}
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <p className="text-xs font-semibold text-muted-foreground">ACTION(S) ADMIN</p>
        <div className="space-y-2 mt-2">
          {space.status === 'available' && (
            <>
              <Button onClick={onReserveForUser} className="w-full">Réserver pour un utilisateur</Button>
              <Button variant="secondary" onClick={onMaintenance} className="w-full border-destructive text-destructive hover:bg-destructive/10">Mettre en maintenance</Button>
            </>
          )}
          {space.status === 'reserved' && (
            <Button variant="secondary" onClick={onEditReservation} className="w-full">Modifier la réservation</Button>
          )}
          {space.status === 'maintenance' && (
            <Button variant="secondary" onClick={onRemoveMaintenance} className="w-full">Retirer de maintenance</Button>
          )}
        </div>
      </div>
    </Card>
  );
}