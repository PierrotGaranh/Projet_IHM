'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { ActiveLink } from '@/components/active-link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Home, Calendar, Car, User, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 rounded-lg bg-primary animate-pulse" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-semibold">Accès refusé</p>
          <button onClick={() => { logout(); router.push('/auth/login'); }} className="btn-primary cursor-pointer">Retour à la connexion</button>
        </div>
      </div>
    );
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
            <ActiveLink href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">P</div>
              <span className="font-bold text-foreground hidden sm:inline">ParkHub</span>
            </ActiveLink>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <ActiveLink
                  key={item.href}
                  href={item.href}
                  activeClassName="bg-muted text-foreground"
                  inactiveClassName="text-muted-foreground hover:text-foreground hover:bg-muted"
                  className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </ActiveLink>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <button onClick={() => { logout(); router.push('/auth/login'); }} className="btn-secondary text-sm flex items-center gap-2 cursor-pointer">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
          <div className="md:hidden py-3 border-t border-border space-y-2">
            {navItems.map((item) => (
              <ActiveLink
                key={item.href}
                href={item.href}
                activeClassName="bg-muted text-foreground"
                inactiveClassName="text-muted-foreground hover:text-foreground hover:bg-muted"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </ActiveLink>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <footer className="border-t border-border bg-card mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ParkHub. Tous les droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}