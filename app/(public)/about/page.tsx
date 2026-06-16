'use client';

import { Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AwardCard } from '@/components/molecules/AwardCard';
import { History } from '@/components/organisms/History';
import { ValuesGrid } from '@/components/organisms/ValuesGrid';
import { Users, Heart, Shield } from 'lucide-react';

function AboutPageContent() {
  const isMobile = useIsMobile();

  const values = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: 'Simplicité',
      description: 'Une interface intuitive qui rend la réservation accessible à tous.',
      iconBgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: 'Sécurité',
      description: 'Vos données et transactions sont protégées par les meilleures technologies.',
      iconBgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: <Heart className="w-6 h-6 text-accent" />,
      title: 'Écologie',
      description: "Nous encourageons les mobilités douces et la réduction de l'empreinte carbone.",
      iconBgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
  ];

  return (
    <div className={`max-w-5xl mx-auto px-4 ${isMobile ? 'pt-6 pb-12 space-y-12' : 'py-16 space-y-16'}`}>
      <div className="text-center space-y-2">
        <h1 className={`font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${
          isMobile ? 'text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'
        }`}>
          À propos de ParkHub
        </h1>
        <p className={`text-muted-foreground max-w-2xl mx-auto ${isMobile ? 'text-base' : 'text-lg md:text-xl'}`}>
          Nous transformons la gestion de parking en une expérience simple, rapide et sécurisée.
        </p>
      </div>

      <History />

      <div className="space-y-6">
        <div className="text-center">
          <h2 className={`font-bold mb-2 ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'}`}>Nos valeurs</h2>
          <p className="text-muted-foreground text-sm">Ce qui nous guide au quotidien</p>
        </div>
        <ValuesGrid values={values} isMobile={isMobile} />
      </div>

      <AwardCard />
    </div>
  );
}

export default function AboutPage() { return <Suspense fallback={null}><AboutPageContent /></Suspense>; }