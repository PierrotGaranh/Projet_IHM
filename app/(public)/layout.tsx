'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppIcon } from '@/components/atoms/AppIcon';
import { Button } from '@/components/atoms/Button';
import { Footer } from '@/components/organisms/Footer';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin' : '/home';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-all group">
              <AppIcon className="w-7 h-7 text-white" />
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
                ParkHub
              </span>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:hidden">
                ParkHub
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/login">
                      <Button variant="secondary" className="font-medium">Connexion</Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" className="font-medium shadow-md">Inscription</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={dashboardLink}>
                      <Button variant="primary" className="font-medium shadow-md">
                        Tableau de bord
                      </Button>
                    </Link>
                    <Button variant="secondary" onClick={handleLogout} className="gap-2">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </Button>
                  </>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border space-y-3">
              <div className="pt-2 flex flex-col gap-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" className="w-full justify-center">Connexion</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-center">Inscription</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={dashboardLink} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-center">Tableau de bord</Button>
                    </Link>
                    <Button variant="secondary" onClick={handleLogout} className="w-full justify-center gap-2">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}