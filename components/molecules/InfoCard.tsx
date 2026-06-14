import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';
import { useIsMobile } from '@/hooks/use-mobile';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function InfoCard({ title, children, icon }: InfoCardProps) {
  const isMobile = useIsMobile();
  return (
    <Card className={`${isMobile ? 'p-5' : 'p-6'} border-l-4 border-l-accent bg-accent/5 space-y-3`}>
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1">{icon}</div>}
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{children}</p>
        </div>
      </div>
    </Card>
  );
}