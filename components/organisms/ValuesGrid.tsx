import { Card } from '@/components/atoms/Card';
import { HorizontalScroll } from '@/components/molecules/HorizontalScroll';
import { ReactNode } from 'react';

interface ValueItem {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

interface ValuesGridProps {
  values: ValueItem[];
  isMobile?: boolean;
}

function ValuesCard({ icon, title, description, iconBgColor = 'bg-primary/10', iconColor = 'text-primary' }: ValueItem) {
  return (
    <Card className="h-full p-6 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all flex flex-col">
      <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mx-auto mb-4 ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm flex-1">{description}</p>
    </Card>
  );
}

export function ValuesGrid({ values, isMobile = false }: ValuesGridProps) {
  if (isMobile) {
    return (
      <HorizontalScroll gap={4}>
        {values.map((value, idx) => (
          <div key={idx} className="snap-center shrink-0 w-[280px]">
            <ValuesCard {...value} />
          </div>
        ))}
      </HorizontalScroll>
    );
  }

  return (
    <div className="grid sm:grid-cols-3 gap-6 auto-rows-fr">
      {values.map((value, idx) => (
        <ValuesCard key={idx} {...value} />
      ))}
    </div>
  );
}