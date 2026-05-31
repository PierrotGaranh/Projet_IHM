import { Card } from '@/components/atoms/Card';

interface SystemInfoProps {
  version?: string;
  lastUpdated?: Date;
  status?: 'online' | 'offline';
}

export function SystemInfo({ version = 'v1.0.0', lastUpdated = new Date(), status = 'online' }: SystemInfoProps) {
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Informations système</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2"><span className="text-muted-foreground">Version</span><span className="font-semibold">{version}</span></div>
        <div className="flex justify-between py-2 border-t border-border"><span className="text-muted-foreground">Dernière mise à jour</span><span className="font-semibold">{lastUpdated.toLocaleDateString('fr-FR')}</span></div>
        <div className="flex justify-between py-2 border-t border-border"><span className="text-muted-foreground">Statut</span><span className="inline-flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-secondary' : 'bg-destructive'}`} /><span className="font-semibold">{status === 'online' ? 'En ligne' : 'Hors ligne'}</span></span></div>
      </div>
    </Card>
  );
}