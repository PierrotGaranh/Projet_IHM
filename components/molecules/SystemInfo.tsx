import { Card } from '@/components/atoms/Card';

export function SystemInfo() {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Informations système</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2">
          <span className="text-muted-foreground">Version</span>
          <span className="font-semibold">v1.0.0</span>
        </div>
        <div className="flex justify-between py-2 border-t border-border">
          <span className="text-muted-foreground">Dernière mise à jour</span>
          <span className="font-semibold">{(new Date()).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className="flex justify-between py-2 border-t border-border">
          <span className="text-muted-foreground">Statut</span>
          <span className="inline-flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-semibold">En ligne</span>
          </span>
        </div>
      </div>
    </Card>
  );
}