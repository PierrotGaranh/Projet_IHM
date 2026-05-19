'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { ActiveLink } from '@/components/active-link';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-semibold">Accès refusé</p>
          <p className="text-muted-foreground text-sm">Seuls les administrateurs peuvent accéder à cette section</p>
          <button onClick={() => { logout(); router.push('/auth/login'); }} className="btn-primary">
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/parking', label: 'Gestion parking', icon: Car },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/reservations', label: 'Réservations', icon: Calendar },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-border">
            <ActiveLink href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">P</div>
              <span className="font-bold text-foreground">ParkHub Admin</span>
            </ActiveLink>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {adminNavItems.map((item) => (
              <ActiveLink
                key={item.href}
                href={item.href}
                activeClassName="bg-muted text-foreground"
                inactiveClassName="text-muted-foreground hover:text-foreground hover:bg-muted"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </ActiveLink>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-border space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">CONNECTÉ</p>
              <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button onClick={() => { logout(); router.push('/auth/login'); }} className="btn-secondary w-full text-sm flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </aside>
      <div className="md:ml-64">
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}