'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
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

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-semibold">Accès refusé</p>
          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="btn-primary"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Accueil' },
    { href: '/dashboard/reservations', label: 'Mes réservations' },
    { href: '/dashboard/booking', label: 'Réserver une place' },
    { href: '/dashboard/profile', label: 'Mon profil' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                P
              </div>
              <span className="font-bold text-foreground hidden sm:inline">ParkHub</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/auth/login');
                }}
                className="btn-secondary text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden py-3 border-t border-border space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ParkHub. Tous les droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
