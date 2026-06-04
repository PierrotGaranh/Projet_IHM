'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { useIsMobile } from '@/hooks/use-mobile'
import { DashboardNavbar } from '@/components/organisms/DashboardNavbar';
import { Footer } from '@/components/organisms/Footer';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { LoadingScreen } from '@/components/atoms/LoadingScreen';
import { AccessDenied } from '@/components/molecules/AccessDenied';
import { useState, useEffect } from 'react';
import Loading from '../(auth)/login/loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, logout, isLoading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push('/login');
  };

  useEffect(() => {
    if (!isLoading && !isLoggingOut && (!user)) {
      router.push('/login');
    }
  }, [isLoading, user, router, isLoggingOut]);

  if (isLoggingOut) return <Loading />;
  if (isLoading) return <LoadingScreen />;
  if ((!user) && (!isLoggingOut && !isLoading)) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar isMobile={isMobile} user={user!} onLogout={() => setShowLogoutModal(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeToggle />
      </div>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { setShowLogoutModal(false); handleLogout(); }}
        message="Êtes-vous sûr de vouloir procéder à la déconnexion ?"
      />
    </div>
  );
}