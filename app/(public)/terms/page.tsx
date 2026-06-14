'use client';

import { LegalCard } from '@/components/molecules/LegalCard';
import { FileCheck, User, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function TermsPage() {
  const isMobile = useIsMobile();

  return (
    <div className={`max-w-4xl mx-auto px-4 ${isMobile ? 'pt-6 pb-12' : 'py-16'} space-y-8`}>
      <div className="text-center space-y-2">
        <h1 className={`font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${
          isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'
        }`}>
          Conditions d'utilisation
        </h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Dernière mise à jour : 1er juin 2025
        </p>
      </div>
      <div className="space-y-6">
        <LegalCard icon={FileCheck} title="Acceptation des conditions" iconColor="text-accent">
          <p className="text-muted-foreground text-sm md:text-base">
            En accédant et en utilisant le site ParkHub, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
        </LegalCard>
        <LegalCard icon={User} title="Comptes utilisateur" iconColor="text-accent">
          <p className="text-muted-foreground text-sm md:text-base">
            Vous êtes responsable de la confidentialité de votre compte et de votre mot de passe. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.
          </p>
        </LegalCard>
        <LegalCard icon={Calendar} title="Réservations et annulations" iconColor="text-accent">
          <p className="text-muted-foreground text-sm md:text-base">
            Les réservations peuvent être annulées jusqu'à 30 minutes avant l'heure de début. Passé ce délai, aucun remboursement ne sera effectué. ParkHub se réserve le droit d'annuler une réservation en cas de force majeure.
          </p>
        </LegalCard>
        <LegalCard icon={AlertTriangle} title="Responsabilité" iconColor="text-accent">
          <p className="text-muted-foreground text-sm md:text-base">
            ParkHub n'est pas responsable des dommages indirects, pertes de données ou préjudices liés à l'utilisation du parking. Le conducteur est seul responsable de son véhicule.
          </p>
        </LegalCard>
        <LegalCard icon={RefreshCw} title="Modifications" iconColor="text-accent">
          <p className="text-muted-foreground text-sm md:text-base">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page.
          </p>
        </LegalCard>
      </div>
    </div>
  );
}