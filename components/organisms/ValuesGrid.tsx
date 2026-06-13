import { Card } from '@/components/atoms/Card';
import { ReactNode } from 'react';

interface ValueItem {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

function ValuesCard({ icon, title, description, iconBgColor = 'bg-primary/10', iconColor = 'text-primary' }: ValueItem) {
  return (
    <Card className="p-6 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all">
      <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mx-auto mb-4 ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
  );
}

interface ValuesGridProps {
  values: ValueItem[];
}

export function ValuesGrid({ values }: ValuesGridProps) {
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {values.map((value, idx) => (
        <ValuesCard key={idx} {...value} />
      ))}
    </div>
  );
}