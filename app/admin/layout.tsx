'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/atoms/Button';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { LoadingScreen } from '@/components/atoms/LoadingScreen';
import { AccessDenied } from '@/components/molecules/AccessDenied';
import { AdminLayoutSidebar } from '@/components/organisms/AdminLayoutSidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Loading from '../(auth)/login/loading';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push('/login');
  };

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!isLoading && !isLoggingOut && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isLoading, user, router, isLoggingOut]);

  if (isLoggingOut) return <Loading />;
  if (isLoading) return <LoadingScreen />;
  if ((!user || user.role !== 'admin') && (!isLoggingOut && !isLoading)) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-background">
      <AdminLayoutSidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogoutClick={() => setShowLogoutModal(true)}
      />
      <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-6">
          {isMobile && (
            <Button variant="ghost" onClick={() => setSidebarOpen(true)} className="p-2 text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground hidden sm:block">Admin Panel</p>
          </div>
        </header>
        <main className="p-6">{children}</main>
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </div>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
        message="Êtes-vous sûr de vouloir procéder à la déconnexion ?"
      />
    </div>
  );
}