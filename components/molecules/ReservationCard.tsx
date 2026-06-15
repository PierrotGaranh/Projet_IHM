import { Reservation, ParkingSpace } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReservationCardProps {
  reservation: Reservation;
  space: ParkingSpace | undefined;
  actions?: React.ReactNode;
}

export function ReservationCard({ reservation, space, actions }: ReservationCardProps) {
  const isMobile = useIsMobile();
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  const isOngoing = reservation.status === 'active' && startDate <= new Date() && endDate >= new Date();
  const statusLabel = reservation.status === 'active' ? (isOngoing ? 'En cours' : 'Active') : reservation.status === 'completed' ? 'Complétée' : 'Annulée';
  const statusVariant = isOngoing ? 'warning' : reservation.status === 'active' ? 'success' : reservation.status === 'completed' ? 'info' : 'destructive';

  return (
    <Card className={`${isMobile ? 'p-5' : 'p-6'} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Place {space?.number || 'N/A'} - Section {space?.section || 'N/A'}</h3>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">ID: {reservation.id}</p>
        </div>
        {actions && <div className="flex flex-row gap-2">{actions}</div>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
        <div><p className="text-muted-foreground text-xs">Début</p><p className="font-semibold text-sm">{startDate.toLocaleDateString('fr-FR')}</p><p className="text-xs">{startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p></div>
        <div><p className="text-muted-foreground text-xs">Fin</p><p className="font-semibold text-sm">{endDate.toLocaleDateString('fr-FR')}</p><p className="text-xs">{endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p></div>
        <div><p className="text-muted-foreground text-xs">Type</p><p className="font-semibold text-sm capitalize">{space?.type || 'N/A'}</p></div>
        <div><p className="text-muted-foreground text-xs">Montant</p><p className="font-semibold text-sm">{reservation.amount.toFixed(2)} €</p></div>
        <div className="col-span-2 sm:col-span-1"><p className="text-muted-foreground text-xs">Véhicule</p><p className="font-semibold text-sm">{reservation.vehiclePlate || 'N/A'}</p></div>
      </div>
    </Card>
  );
}