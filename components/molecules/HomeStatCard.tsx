import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';

interface HomeStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
  iconBg?: string;
  iconColor?: string;
}

export function HomeStatCard({ title, value, icon, description, iconBg = 'bg-primary/10', iconColor = 'text-primary' }: HomeStatCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Card>
  );
}