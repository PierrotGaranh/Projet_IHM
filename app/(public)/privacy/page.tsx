'use client';

import { LegalCard } from '@/components/molecules/LegalCard';
import { Database, Eye, Share2, UserCheck, Cookie } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function PrivacyPage() {
  const isMobile = useIsMobile();

  return (
    <div className={`max-w-4xl mx-auto px-4 ${isMobile ? 'pt-6 pb-12' : 'py-16'} space-y-8`}>
      <div className="text-center space-y-2">
        <h1 className={`font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${
          isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'
        }`}>
          Politique de confidentialité
        </h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Dernière mise à jour : 1er juin 2025
        </p>
      </div>
      <div className="space-y-6">
        <LegalCard icon={Database} title="Collecte des données" iconColor="text-secondary">
          <p className="text-muted-foreground text-sm md:text-base">
            Nous collectons les informations que vous nous fournissez directement (nom, email, numéro de téléphone, plaques d’immatriculation) lors de la création de votre compte ou d’une réservation.
          </p>
        </LegalCard>
        <LegalCard icon={Eye} title="Utilisation des données" iconColor="text-secondary">
          <p className="text-muted-foreground text-sm md:text-base">
            Vos données sont utilisées pour : gérer vos réservations, vous envoyer des confirmations et des rappels, améliorer nos services.
          </p>
        </LegalCard>
        <LegalCard icon={Share2} title="Partage des données" iconColor="text-secondary">
          <p className="text-muted-foreground text-sm md:text-base">
            Nous ne vendons pas vos données à des tiers. Seuls nos prestataires techniques (hébergement, paiement) y ont accès dans le cadre de leurs missions.
          </p>
        </LegalCard>
        <LegalCard icon={UserCheck} title="Vos droits" iconColor="text-secondary">
          <p className="text-muted-foreground text-sm md:text-base">
            Vous pouvez accéder, rectifier ou supprimer vos données en nous contactant à privacy@parkhub.com.
          </p>
        </LegalCard>
        <LegalCard icon={Cookie} title="Cookies" iconColor="text-secondary">
          <p className="text-muted-foreground text-sm md:text-base">
            Nous utilisons des cookies nécessaires au fonctionnement du site. Vous pouvez les désactiver dans les paramètres de votre navigateur.
          </p>
        </LegalCard>
      </div>
    </div>
  );
}