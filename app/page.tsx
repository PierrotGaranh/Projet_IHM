'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.push(isAuthenticated ? '/dashboard' : '/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl mx-auto">
          P
        </div>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}
