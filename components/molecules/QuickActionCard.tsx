import { ReactNode } from 'react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickActionCardProps {
  href: string;
  icon: ReactNode;
  iconColor?: string;
  title: string;
  description: string;
  invite: string;
}

export function QuickActionCard({ href, icon, iconColor='bg-primary/10 group-hover:bg-primary/20', title, description, invite }: QuickActionCardProps) {
  const isMobile = useIsMobile();
  return (
    <Link
      href={href}
      className={`card-base ${isMobile ? 'p-6' : 'p-8'} hover:shadow-md transition-shadow group cursor-pointer block`}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className={`w-12 h-12 rounded-lg ${iconColor} transition-colors flex items-center justify-center`}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform inline-flex">
          {invite} →
        </div>
      </div>
    </Link>
  );
}