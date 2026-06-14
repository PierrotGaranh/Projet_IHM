'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LegalCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  iconColor?: string;
}

export function LegalCard({ icon: Icon, title, children, iconColor = 'text-primary' }: LegalCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="p-6 sm:p-8 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full ${iconColor.replace('text-', 'bg-')}/10 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-3`}>{title}</h2>
          {children}
        </div>
      </div>
    </Card>
  );
}