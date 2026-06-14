import Link from 'next/link';
import { Key } from 'react';
import { User } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ArrowRight } from 'lucide-react';

interface Stat {
  label: String;
  value: String;
  color?: String;
}

interface HeroSectionProps {
  isMobile: boolean; 
  isAuthenticated: boolean; 
  user: User | null; 
  dashboardLink: string; 
  stats: Stat[];
}

export function HeroSection({ isMobile, isAuthenticated, user, dashboardLink, stats }: HeroSectionProps) {
  if (isMobile) {
    return (
      <section className="relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Gérez vos{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              places de parking
            </span>{' '}
            en toute simplicité
          </h1>
          <p className="text-base text-muted-foreground px-2">
            ParkHub vous permet de réserver, gérer et optimiser vos places de parking.
            Solution intuitive pour particuliers et professionnels.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {!isAuthenticated ? (
              <>
                <Link href="/register" className="w-full">
                  <Button variant="primary" className="w-full py-3 gap-2 group">
                    Commencer gratuitement
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about" className="w-full">
                  <Button variant="secondary" className="w-full py-3 gap-2">
                    En savoir plus
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={dashboardLink} className="w-full">
                  <Button variant="primary" className="w-full py-3 gap-2 group">
                    Accéder à mon espace
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {user?.firstName && (
                  <div className="text-center text-sm text-muted-foreground bg-secondary/10 py-2 rounded-lg">
                    Bon retour, <span className="font-semibold text-foreground">{user.firstName}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Gérez vos{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            places de parking
          </span>{' '}
          en toute simplicité
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ParkHub vous permet de réserver, gérer et optimiser vos places de parking.
          Solution intuitive pour particuliers et professionnels.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link href="/register">
                <Button variant="primary" className="py-2 gap-2 group">
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" className="py-2 gap-2 group">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={dashboardLink}>
                <Button variant="primary" className="py-2 gap-2 group">
                  Accéder à mon espace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" className="py-2 gap-2 group">
                  En savoir plus
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-4 text-base text-muted-foreground">
            Bon retour, <span className="font-semibold text-foreground">{user?.firstName}</span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16"
      >
        {stats.map((stat) => (
          <Card key={stat.label as Key} className="p-6 text-center backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-0 shadow-lg">
            <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </motion.div>
    </section>
  );
}