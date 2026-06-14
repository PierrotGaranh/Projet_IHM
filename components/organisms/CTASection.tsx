import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTASectionProps {
  isMobile: boolean; 
  isAuthenticated: boolean; 
  dashboardLink: string
}

export function CTASection({ isMobile, isAuthenticated, dashboardLink }: CTASectionProps) {
  const containerClass = isMobile ? "relative max-w-md mx-auto" : "relative max-w-5xl mx-auto";
  const cardClass = isMobile
    ? "p-6 text-center space-y-4 border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm"
    : "p-8 md:p-12 text-center space-y-6 border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm";
  const titleClass = isMobile ? "text-xl font-bold" : "text-3xl md:text-4xl font-bold";
  const descClass = isMobile ? "text-sm text-muted-foreground" : "text-lg text-muted-foreground max-w-xl mx-auto";
  const buttonClass = isMobile ? "w-full py-2 gap-2 group" : "py-2 gap-2 group";

  return (
    <section className={containerClass}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10" />
      <Card className={cardClass}>
        {!isAuthenticated ? (
          <>
            <h2 className={titleClass}>Prêt à simplifier votre stationnement ?</h2>
            <p className={descClass}>Rejoignez des milliers d'utilisateurs qui nous font confiance.</p>
            <Link href="/register">
              <Button variant="primary" className={buttonClass}>
                Créer un compte gratuit
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className={titleClass}>Retrouvez votre espace personnel</h2>
            <p className={descClass}>Gérez vos réservations, modifiez votre profil et plus encore.</p>
            <Link href={dashboardLink}>
              <Button variant="primary" className={buttonClass}>
                Accéder au tableau de bord
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </>
        )}
      </Card>
    </section>
  );
}