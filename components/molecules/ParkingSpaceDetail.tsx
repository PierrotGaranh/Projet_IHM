import { ParkingSpace } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';

interface ParkingSpaceDetailProps {
  space: ParkingSpace;
  onClear: () => void;
  onBook?: () => void;
  isAdmin?: boolean;
  adminActions?: React.ReactNode;
}

const typeLabels: Record<string, string> = { compact: 'Compact', standard: 'Standard', premium: 'Premium' };
const featureLabels: Record<string, string> = { handicap: 'Handicapé', chargeur: 'Chargeur électrique', surveillée: 'Surveillée', sécurisée: 'Sécurisée' };

export function ParkingSpaceDetail({ space, onClear }: ParkingSpaceDetailProps) {
  return (
    <Card className="p-4 bg-secondary/5 border-2 border-secondary space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Place sélectionnée</p>
          <p className="text-2xl font-bold text-foreground">{space.number}</p>
        </div>
        <Button variant="ghost" onClick={onClear} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></Button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Niveau</span><span className="font-semibold">{space.level}</span></div>
        <div className="flex justify-between"><span>Type</span><span className="font-semibold capitalize">{typeLabels[space.type]}</span></div>
        <div className="flex justify-between"><span>Prix/heure</span><span className="font-semibold">{space.pricePerHour} €</span></div>
      </div>
      {space.features.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground font-semibold">Équipements</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {space.features.map(f => (
              <span key={f} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{featureLabels[f]}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}