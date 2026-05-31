import { Card } from '@/components/atoms/Card';

export function DistributionStatItem({ color, label, value }: { color: string; label: string; value: number }) {
  const colorClasses: Record<string, string> = {
    secondary: 'bg-secondary text-secondary',
    destructive: 'bg-destructive text-destructive',
    primary: 'bg-primary text-primary',
    muted: 'bg-muted text-muted-foreground',
  };
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colorClasses[color].split(' ')[0]}`} />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]}`}>{value}</p>
    </Card>
  );
}