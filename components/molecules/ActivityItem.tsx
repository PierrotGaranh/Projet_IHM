'use client';

import { ActivityLog } from '@/lib/types';

interface ActivityItemProps {
  log: ActivityLog;
}

export function ActivityItem({ log }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
      <div className="flex-1">
        <p className="text-sm text-foreground">{log.message}</p>
        <p className="text-xs text-muted-foreground">{log.timestamp.toLocaleString('fr-FR')}</p>
      </div>
    </div>
  );
}