'use client';

import { ShieldAlert, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/atoms/Button';

interface AccessDeniedProps {
  onRetry?: () => void;
}

export function AccessDenied({ onRetry }: AccessDeniedProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleGoToLogin = () => {
    if (onRetry) {
      onRetry();
    } else {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Accès refusé</h1>
          <p className="text-muted-foreground">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
        </div>
        <Button onClick={handleGoToLogin} className="inline-flex items-center gap-2">
          <LogIn className="w-4 h-4" /> Retour à la connexion
        </Button>
      </div>
    </div>
  );
}