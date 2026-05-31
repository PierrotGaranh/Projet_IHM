import { Minimize2, CarFront, Crown } from 'lucide-react';
import { Card } from '@/components/atoms/Card';
import { PriceCard } from '@/components/molecules/PriceCard';

export function PriceDisplay() {
  return (
    <Card className="p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <PriceCard icon={<Minimize2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />} title="Compact" price="2€" description="Idéale pour les petits véhicules" />
        <PriceCard icon={<CarFront className="w-5 h-5 text-gray-600 dark:text-gray-400" />} title="Standard" price="3€" description="Bon équilibre entre la place et le prix" />
        <PriceCard icon={<Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />} title="Premium" price="5€" description="Recharge incluse - Sécurité renforcée - Place surveillée" isPremium />
      </div>
    </Card>
  );
}