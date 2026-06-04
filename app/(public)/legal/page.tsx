import { LegalCard } from '@/components/molecules/LegalCard';
import { Building, User, Globe, Copyright } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Mentions légales
        </h1>
        <p className="text-muted-foreground mt-2">Informations conformément à la loi n° 2004-575 du 21 juin 2004</p>
      </div>
      <div className="space-y-6">
        <LegalCard icon={Building} title="Éditeur du site" iconColor="text-primary">
          <div className="space-y-1 text-muted-foreground">
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
          <p className="text-muted-foreground">Jean Dupont, Président</p>
        </LegalCard>
        <LegalCard icon={Globe} title="Hébergement" iconColor="text-primary">
          <p className="text-muted-foreground">Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
        </LegalCard>
        <LegalCard icon={Copyright} title="Propriété intellectuelle" iconColor="text-primary">
          <p className="text-muted-foreground">
            L'ensemble des éléments du site (textes, logos, images) sont protégés par le droit d'auteur.
            Toute reproduction est interdite sans autorisation préalable.
          </p>
        </LegalCard>
      </div>
    </div>
  );
}