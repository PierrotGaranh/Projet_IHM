'use client';

import { useState, ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExpandableCardProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ExpandableCard({ title, children, defaultOpen = false }: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();

  return (
    <Card className={`${isMobile ? '' : 'p-4'} overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all`}>
      <button
        className="w-full text-left cursor-pointer p-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>{title}</h3>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>
      <div className={cn('px-6 pb-6 text-muted-foreground', isOpen ? 'block' : 'hidden')}>
        <div className={isMobile ? 'text-sm' : 'text-base'}>{children}</div>
      </div>
    </Card>
  );
}