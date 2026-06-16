'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/atoms/Button';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { LoadingScreen } from '@/components/atoms/LoadingScreen';
import { AccessDenied } from '@/components/molecules/AccessDenied';
import { AdminSidebar } from '@/components/organisms/AdminSidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Loading from '../(auth)/login/loading';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const isMobile = useIsMobile(1400);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.',
      variant: 'success',
    });
    router.push('/login');
  };

  const isSidebarVisible = !isMobile || sidebarOpen;

  useEffect(() => {
    if (!isLoading && !isLoggingOut && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isLoading, user, router, isLoggingOut]);

  if (isLoggingOut) return <Loading />;
  if (isLoading) return <LoadingScreen />;
  if ((!user || user.role !== 'admin') && (!isLoggingOut && !isLoading)) return <AccessDenied />;

  const marginLeft = !isMobile ? (sidebarExpanded ? 'ml-64' : 'ml-16') : '';

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isMobile={isMobile}
        isOpen={isSidebarVisible}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogoutClick={() => setShowLogoutModal(true)}
        collapsed={!isMobile}
        onExpandChange={setSidebarExpanded}
      />
      <div className={`transition-all duration-300 ${marginLeft}`}>
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
          {isMobile && (
            <Button variant="ghost" onClick={() => setSidebarOpen(true)} className="p-2 text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="mr-4"><ThemeToggle /></div>
            <p className="text-sm text-muted-foreground hidden sm:block">Admin Panel</p>
          </div>
        </header>
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">{children}</main>
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