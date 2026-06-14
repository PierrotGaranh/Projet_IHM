import { ReactNode } from 'react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminQuickActionCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function AdminQuickActionCard({ href, icon, title, description }: AdminQuickActionCardProps) {
  const isMobile = useIsMobile();

  if(isMobile) {
    return (
      <Link
        href={href}
        className={`card-base ${isMobile ? 'p-5' : 'p-6'} group block`}
      >
        <div className="p-2 flex justify-between">
          <div className="flex gap-4">
            <span>{icon}</span>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className='text-primary font-bold'>→</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`card-base ${isMobile ? 'p-5' : 'p-6'} hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group block`}
    >
      <div className="space-y-3">
        {icon}
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}