import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Minimize2, CarFront, Crown } from 'lucide-react';
import { Card } from '@/components/atoms/Card';

interface PriceCardProps {
  icon: ReactNode;
  title: string;
  price: string;
  description: string;
  isPremium?: boolean;
}

function PriceCard({ icon, title, price, description, isPremium = false }: PriceCardProps) {
  return (
    <div className={`flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors rounded-lg sm:rounded-none ${isPremium ? 'hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10' : ''}`}>
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
        isPremium ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{title}</span>
            {isPremium && <span className="text-[10px] font-bold bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">Recommandé</span>}
          </div>
          <span className={cn("text-base font-bold text-foreground",
            isPremium ? 'text-yellow-600 dark:text-yellow-400' : ''
          )}>{price}<span className="text-xs font-normal text-muted-foreground">/h</span></span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

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