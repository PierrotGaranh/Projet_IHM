import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';
import { BarChart3, CheckCircle2 } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
}

interface DashboardStatsGridProps {
  activeReservations: number;
  availableSpaces: number;
  occupancyRate: number;
  totalRevenue: number;
}

function DashboardStatCard({ title, value, unit = '', icon, description, color = 'primary' }: DashboardStatCardProps) {
  const bgColors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    destructive: 'bg-destructive/10 text-destructive',
  };
  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${bgColors[color]} flex items-center justify-center`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}{unit && <span className="text-lg ml-1">{unit}</span>}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </Card>
  );
}

export function DashboardStatsGrid({ activeReservations, availableSpaces, occupancyRate, totalRevenue }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard title="Réservations actives" value={activeReservations} icon={<CheckCircle2 className="w-5 h-5" />} color="secondary" description="En cours de validité" />
      <DashboardStatCard title="Places disponibles" value={availableSpaces} icon={<BarChart3 className="w-5 h-5" />} color="accent" description="Libres" />
      <DashboardStatCard title="Taux d'occupation" value={Math.round(occupancyRate)} unit="%" icon={<BarChart3 className="w-5 h-5" />} color="primary" description="Places occupées + réservées" />
      <DashboardStatCard title="Revenu total" value={totalRevenue.toFixed(0)} unit="€" icon={<CheckCircle2 className="w-5 h-5" />} color="secondary" description="Réservations actives + complétées" />
    </div>
  );
}