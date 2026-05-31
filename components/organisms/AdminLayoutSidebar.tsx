'use client';

import { ActiveLink } from '@/components/molecules/ActiveLink';
import { AppIcon } from '@/components/atoms/AppIcon'
import { Button } from '@/components/atoms/Button';
import { LayoutDashboard, Car, Users, Calendar, BarChart3, Settings, LogOut, X } from 'lucide-react';

interface AdminLayoutSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  user: { firstName: string; lastName: string; email: string } | null;
  onLogoutClick: () => void;
}

export function AdminLayoutSidebar({ isMobile, isOpen, onClose, user, onLogoutClick }: AdminLayoutSidebarProps) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/parking', label: 'Gestion parking', icon: Car },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/reservations', label: 'Réservations', icon: Calendar },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <ActiveLink href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <AppIcon  className="w-8 h-8"/>
              <span className="font-bold text-foreground">ParkHub Admin</span>
            </ActiveLink>
            {isMobile && (
              <Button variant="ghost" onClick={onClose} className="p-1 text-muted-foreground">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <ActiveLink
                key={item.href}
                href={item.href}
                activeClassName="bg-primary/10 text-primary"
                inactiveClassName="text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                onClick={() => {
                  if (isMobile) onClose();
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </ActiveLink>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-border space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">CONNECTÉ</p>
              <p className="text-sm font-semibold text-foreground">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="secondary" onClick={onLogoutClick} className="w-full text-sm flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}