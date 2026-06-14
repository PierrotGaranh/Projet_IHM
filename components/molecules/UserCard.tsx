import { User } from '@/lib/types';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const isMobile = useIsMobile();
  return (
    <Card className={`${isMobile ? 'p-5' : 'p-6'} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex-shrink-0 self-start">
          <Badge variant={user.role === 'admin' ? 'destructive' : 'success'}>
            {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-border">
        <div className="break-words">
          <p className="text-muted-foreground text-xs">Téléphone</p>
          <p className="font-semibold">{user.phone || 'N/A'}</p>
        </div>
        <div className="break-words">
          <p className="text-muted-foreground text-xs">Immatriculations</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.vehiclePlates.length ? (
              user.vehiclePlates.map((plate, idx) => (
                <span key={idx} className="inline-block bg-muted px-1.5 py-0.5 rounded text-xs break-all">{plate}</span>
              ))
            ) : (
              <span className="text-muted-foreground">Aucune</span>
            )}
          </div>
        </div>
        <div className="break-words">
          <p className="text-muted-foreground text-xs">Inscrit depuis</p>
          <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </Card>
  );
}