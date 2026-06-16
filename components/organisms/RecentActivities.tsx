'use client';

import { ActivityLog } from '@/lib/types';
import { Activity } from 'lucide-react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import { ActivityItem } from '@/components/molecules/ActivityItem';

interface RecentActivitiesProps {
  activities: ActivityLog[];
  limit?: number;
}

export function RecentActivities({ activities, limit = 6 }: RecentActivitiesProps) {
  const displayed = activities.slice(0, limit);
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Activité récente</h2>
        </div>
        <Link href="/admin/activities">
          <Button variant="secondary" className="gap-1">
            Voir plus <span className="text-lg leading-none">+</span>
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {displayed.map((log) => (
          <ActivityItem key={log.id} log={log} />
        ))}
      </div>
    </Card>
  );
}