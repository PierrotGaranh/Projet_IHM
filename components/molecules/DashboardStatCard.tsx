import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
}

export function DashboardStatCard({ title, value, unit = '', icon, description, color = 'primary' }: DashboardStatCardProps) {
  const bgColors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    destructive: 'bg-destructive/10 text-destructive',
  };
  return (
    <Card className="space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${bgColors[color]} flex items-center justify-center`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}{unit && <span className="text-lg ml-1">{unit}</span>}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </Card>
  );
}