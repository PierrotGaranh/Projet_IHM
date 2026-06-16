'use client';

import { Suspense } from 'react';
import { LegalCard } from '@/components/molecules/LegalCard';
import { Building, User, Globe, Copyright } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

function LegalPageContent() {
  const isMobile = useIsMobile();

  return (
    <div className={`max-w-4xl mx-auto px-4 ${isMobile ? 'pt-6 pb-12' : 'py-16'} space-y-8`}>
      <div className="text-center space-y-2">
        <h1 className={`font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${
          isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'
        }`}>
          Mentions légales
        </h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Informations conformément à la loi n° 2004-575 du 21 juin 2004
        </p>
      </div>
      <div className="space-y-6">
        <LegalCard icon={Building} title="Éditeur du site" iconColor="text-primary">
          <div className="space-y-1 text-muted-foreground text-sm md:text-base">
            <p><strong>ParkHub SAS</strong></p>
            <p>123 Avenue de la République</p>
            <p>75011 Paris</p>
            <p>Capital social de 50 000 €</p>
            <p>RCS Paris B 123 456 789</p>
            <p>Tél : 01 23 45 67 89</p>
            <p>Email : contact@parkhub.com</p>
          </div>
        </LegalCard>
        <LegalCard icon={User} title="Directeur de la publication" iconColor="text-primary">
          <p className="text-muted-foreground text-sm md:text-base">Jean Dupont, Président</p>
        </LegalCard>
        <LegalCard icon={Globe} title="Hébergement" iconColor="text-primary">
          <p className="text-muted-foreground text-sm md:text-base">Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
        </LegalCard>
        <LegalCard icon={Copyright} title="Propriété intellectuelle" iconColor="text-primary">
          <p className="text-muted-foreground text-sm md:text-base">
            L'ensemble des éléments du site (textes, logos, images) sont protégés par le droit d'auteur.
            Toute reproduction est interdite sans autorisation préalable.
          </p>
        </LegalCard>
      </div>
    </div>
  );
}

export default function LegalPage() { return <Suspense fallback={null}><LegalPageContent /></Suspense>; }