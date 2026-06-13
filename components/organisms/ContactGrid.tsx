import { Card } from '@/components/atoms/Card';
import { ReactNode } from 'react';

interface EmailCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  email: string;
  emailLabel?: string;
}

function EmailCard({ icon, title, description, email, emailLabel = 'Email' }: EmailCardProps) {
  return (
    <Card className="p-8 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all group">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      <a href={`mailto:${email}`} className="text-primary font-medium hover:underline">
        {emailLabel}
      </a>
    </Card>
  );
}

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  content: string | ReactNode;
}

function ContactInfoCard({ icon, title, content }: ContactInfoCardProps) {
  return (
    <Card className="p-6 flex items-center gap-4 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        {typeof content === 'string' ? <p className="text-muted-foreground">{content}</p> : content}
      </div>
    </Card>
  );
}

interface ContactGridProps {
  emails: EmailCardProps[];
  contactInfos: ContactInfoCardProps[];
}

export function ContactGrid({ emails, contactInfos }: ContactGridProps) {
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8">
        {emails.map((card, idx) => (
          <EmailCard key={idx} {...card} />
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {contactInfos.map((card, idx) => (
          <ContactInfoCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}