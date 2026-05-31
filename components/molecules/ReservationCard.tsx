import { Reservation, ParkingSpace } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface ReservationCardProps {
  reservation: Reservation;
  space: ParkingSpace | undefined;
  actions?: React.ReactNode;
}

export function ReservationCard({ reservation, space, actions }: ReservationCardProps) {
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  const isOngoing = reservation.status === 'active' && startDate <= new Date() && endDate >= new Date();
  const statusLabel = reservation.status === 'active' ? (isOngoing ? 'En cours' : 'Active') : reservation.status === 'completed' ? 'Complétée' : 'Annulée';
  const statusVariant = isOngoing ? 'warning' : reservation.status === 'active' ? 'success' : reservation.status === 'completed' ? 'info' : 'destructive';

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">Place {space?.number || 'N/A'} - Niveau {space?.level || 'N/A'}</h3>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">ID: {reservation.id}</p>
        </div>
        {actions}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><p className="text-muted-foreground">Début</p><p className="font-semibold">{startDate.toLocaleDateString('fr-FR')}</p><p className="text-xs">{startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p></div>
        <div><p className="text-muted-foreground">Fin</p><p className="font-semibold">{endDate.toLocaleDateString('fr-FR')}</p><p className="text-xs">{endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p></div>
        <div><p className="text-muted-foreground">Type</p><p className="font-semibold capitalize">{space?.type || 'N/A'}</p></div>
        <div><p className="text-muted-foreground">Montant</p><p className="font-semibold">{reservation.amount.toFixed(2)} €</p></div>
        <div><p className="text-muted-foreground">Véhicule</p><p className="font-semibold">{reservation.vehiclePlate || 'N/A'}</p></div>
      </div>
    </Card>
  );
}