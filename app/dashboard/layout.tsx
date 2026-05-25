'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { ActiveLink } from '@/components/active-link';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoadingScreen } from '@/components/loading-screen';
import { AccessDenied } from '@/components/access-denied';
import { useState, useEffect } from 'react';
import { Home, Calendar, Car, User, LogOut, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Loading from '../auth/login/loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (!isLoading && !isLoggingOut && (!user)) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router, isLoggingOut]);

  if (isLoggingOut) {
    return <Loading/>;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if ((!user) && (!isLoggingOut && !isLoading)) {
    return <AccessDenied />;
  }

  const navItems = [
    { href: '/dashboard', label: 'Accueil', icon: Home },
    { href: '/dashboard/reservations', label: 'Mes réservations', icon: Calendar },
    { href: '/dashboard/booking', label: 'Réserver une place', icon: Car },
    { href: '/dashboard/profile', label: 'Mon profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {isMobile ? (
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground cursor-pointer">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              ) : (
                <ActiveLink href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">P</div>
                  <span className="font-bold text-foreground">ParkHub</span>
                </ActiveLink>
              )}
            </div>

            {!isMobile && (
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <ActiveLink
                    key={item.href}
                    href={item.href}
                    activeClassName="bg-primary/10 text-primary"
                    inactiveClassName="text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </ActiveLink>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button onClick={() => setShowLogoutModal(true)} className="btn-secondary text-sm flex items-center justify-center gap-2 cursor-pointer">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
              <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => { setShowLogoutModal(false); handleLogout(); }}
              />
            </div>
          </div>

          {isMobile && mobileMenuOpen && (
            <div className="py-3 border-t border-border space-y-2">
              {navItems.map((item) => (
                <ActiveLink
                  key={item.href}
                  href={item.href}
                  activeClassName="bg-muted text-foreground"
                  inactiveClassName="text-muted-foreground hover:text-foreground hover:bg-muted"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </ActiveLink>
              ))}
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="border-t border-border bg-card mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ParkHub. Tous droits réservés.</p>
        </div>
      </footer>
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}