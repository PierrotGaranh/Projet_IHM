import { ActivityLog } from '@/lib/types';
import { Activity } from 'lucide-react';
import { Card } from '@/components/atoms/Card';

interface RecentActivitiesProps {
  activities: ActivityLog[];
  limit?: number;
}

export function RecentActivities({ activities, limit = 6 }: RecentActivitiesProps) {
  const displayed = activities.slice(0, limit);
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
      </div>
      <div className="space-y-3">
        {displayed.map((log) => (
          <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{log.message}</p>
              <p className="text-xs text-muted-foreground">{log.timestamp.toLocaleString('fr-FR')}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}