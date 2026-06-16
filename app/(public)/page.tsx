'use client';

import { Suspense } from 'react';
import { Car, Calendar, BarChart3, ShieldCheck, Clock, Users } from 'lucide-react';
import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';
import { CTASection } from '@/components/organisms/CTASection';
import { useAuth } from '@/lib/context';
import { useIsMobile } from '@/hooks/use-mobile';

const features = [
  { icon: Car, title: 'Réservation instantanée', description: 'Trouvez et réservez votre place en quelques clics.', color: 'text-primary', bgColor: 'bg-primary/20' },
  { icon: Calendar, title: 'Gestion flexible', description: 'Modifiez ou annulez vos réservations à tout moment.', color: 'text-secondary', bgColor: 'bg-secondary/20' },
  { icon: BarChart3, title: 'Statistiques avancées', description: 'Suivez l\'occupation, les revenus et les tendances.', color: 'text-accent', bgColor: 'bg-accent/20' },
  { icon: ShieldCheck, title: 'Sécurité renforcée', description: 'Données cryptées et transactions sécurisées.', color: 'text-primary', bgColor: 'bg-primary/20' },
  { icon: Clock, title: 'Disponibilité 24/7', description: 'Accédez à votre espace à tout moment.', color: 'text-secondary', bgColor: 'bg-secondary/20' },
  { icon: Users, title: 'Multi-utilisateurs', description: 'Gérez plusieurs véhicules et profils.', color: 'text-accent', bgColor: 'bg-accent/20' },
];

const stats = [
  { label: 'Utilisateurs actifs', value: '2k+', color: 'primary' },
  { label: 'Places disponibles', value: '250+', color: 'secondary' },
  { label: 'Réservations/mois', value: '500+', color: 'accent' },
];

function LandingPageContent() {
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const dashboardLink = user?.role === 'admin' ? '/admin' : '/home';

  if (isMobile) {
    return (
      <div className="pt-6 pb-12 px-4 space-y-12">
        <HeroSection isMobile={isMobile} isAuthenticated={isAuthenticated} user={user} dashboardLink={dashboardLink} stats={stats}/>
        <FeaturesSection isMobile={isMobile} features={features}/>
        <CTASection isMobile={isMobile} isAuthenticated={isAuthenticated} dashboardLink={dashboardLink} />
      </div>
    );
  }

  return (
    <div className="space-y-24 py-12 px-4">
      <HeroSection isMobile={isMobile} isAuthenticated={isAuthenticated} user={user} dashboardLink={dashboardLink} stats={stats}/>
      <FeaturesSection isMobile={isMobile} features={features}/>
      <CTASection isMobile={isMobile} isAuthenticated={isAuthenticated} dashboardLink={dashboardLink} />
    </div>
  );
}

export default function LandingPage() { return <Suspense fallback={null}><LandingPageContent /></Suspense>; }