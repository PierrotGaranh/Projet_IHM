'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context';
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      logout();
    }
  }, [logout]);

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