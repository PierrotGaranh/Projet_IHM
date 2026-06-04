'use client';

import { ActiveLink } from '@/components/molecules/ActiveLink';
import { AppIcon } from '@/components/atoms/AppIcon'
import { Button } from '@/components/atoms/Button';
import { Menu, X, Home, Calendar, Car, User, LogOut } from 'lucide-react';
import { useState } from 'react';

interface DashboardNavbarProps {
  isMobile: boolean;
  user: { firstName: string; lastName: string; email: string };
  onLogout: () => void;
}

export function DashboardNavbar({isMobile = false, user, onLogout }: DashboardNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { href: '/home', label: 'Accueil', icon: Home },
    { href: '/reservations', label: 'Mes réservations', icon: Calendar },
    { href: '/booking', label: 'Réserver une place', icon: Car },
    { href: '/profile', label: 'Mon profil', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            {!mobileMenuOpen && !isMobile && <ActiveLink href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity ml-2 sm:ml-0">
              <AppIcon className="w-8 h-8"/>
              <span className="font-bold text-foreground">ParkHub</span>
            </ActiveLink>}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {navItems.map((item) => (
              <ActiveLink key={item.href} href={item.href} activeClassName="bg-primary/10 text-primary" inactiveClassName="text-muted-foreground hover:bg-muted/80 hover:text-foreground" className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </ActiveLink>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="secondary" onClick={onLogout} className="text-sm flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="py-3 border-t border-border space-y-2 sm:hidden">
            {navItems.map((item) => (
              <ActiveLink key={item.href} href={item.href} activeClassName="bg-muted text-foreground" inactiveClassName="text-muted-foreground hover:text-foreground hover:bg-muted" className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </ActiveLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}