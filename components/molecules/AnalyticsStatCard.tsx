import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';

interface AnalyticsStatCardProps {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  footnote?: ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
}

export function AnalyticsStatCard({ label, value, subValue, footnote, color = 'primary' }: AnalyticsStatCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };
  return (
    <Card className="p-6 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
      {subValue && <p className="text-xs text-secondary">{subValue}</p>}
      {footnote && <p className="text-xs text-muted-foreground">{footnote}</p>}
    </Card>
  );
}