import { ReactNode } from 'react';
import { Card } from '@/components/atoms/Card';

interface DangerZoneProps {
  title: string;
  description: string;
  action: ReactNode;
}

export function DangerZone({ title, description, action }: DangerZoneProps) {
  return (
    <Card className="border-l-4 border-l-destructive bg-destructive/5 space-y-4">
      <h2 className="text-lg font-semibold text-destructive">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action}
    </Card>
  );
}