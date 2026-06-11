'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/context';
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const wasAuthenticated = isAuthenticated;
    logout();
    if (wasAuthenticated) {
      toast({
        title: 'Vous êtes déconnecté',
        description: 'Veuillez vous reconnecter de nouveau pour accéder à votre compte.',
        variant: 'info',
      });
    }
  }, [isLoading, isAuthenticated, logout, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}