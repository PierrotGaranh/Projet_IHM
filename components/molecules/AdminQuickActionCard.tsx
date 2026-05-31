import { ReactNode } from 'react';
import Link from 'next/link';

interface AdminQuickActionCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function AdminQuickActionCard({ href, icon, title, description }: AdminQuickActionCardProps) {
  return (
    <Link
      href={href}
      className="card-base p-6 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group block"
    >
      <div className="space-y-3">
        {icon}
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}