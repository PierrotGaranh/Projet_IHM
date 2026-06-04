'use client';

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Car, Calendar, BarChart3, ShieldCheck, Clock, Users, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context';

const features = [
  { icon: Car, title: 'Réservation instantanée', description: 'Trouvez et réservez votre place en quelques clics.', color: 'text-primary' },
  { icon: Calendar, title: 'Gestion flexible', description: 'Modifiez ou annulez vos réservations à tout moment.', color: 'text-secondary' },
  { icon: BarChart3, title: 'Statistiques avancées', description: 'Suivez l\'occupation, les revenus et les tendances.', color: 'text-accent' },
  { icon: ShieldCheck, title: 'Sécurité renforcée', description: 'Données cryptées et transactions sécurisées.', color: 'text-primary' },
  { icon: Clock, title: 'Disponibilité 24/7', description: 'Accédez à votre espace à tout moment.', color: 'text-secondary' },
  { icon: Users, title: 'Multi-utilisateurs', description: 'Gérez plusieurs véhicules et profils.', color: 'text-accent' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  const dashboardLink = user?.role === 'admin' ? '/admin' : '/home';

  return (
    <div className="space-y-24 py-12 px-4">
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
          {[
            { label: 'Utilisateurs actifs', value: '2k+', color: 'primary' },
            { label: 'Places disponibles', value: '150+', color: 'secondary' },
            { label: 'Réservations/mois', value: '500+', color: 'accent' },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 text-center backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-0 shadow-lg">
              <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Fonctionnalités clés</h2>
          <p className="text-muted-foreground">Tout ce dont vous avez besoin pour une gestion optimale</p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${feature.color.split('-')[1]}/20 to-${feature.color.split('-')[1]}/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10" />
        <Card className="p-8 md:p-12 text-center space-y-6 border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm">
          {!isAuthenticated ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold">Prêt à simplifier votre stationnement ?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui nous font confiance.
              </p>
              <Link href="/register">
                <Button variant="primary" className="py-2 gap-2 group">
                  Créer un compte gratuit
                  <Sparkles className="w-4 h-4" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold">Retrouvez votre espace personnel</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Gérez vos réservations, modifiez votre profil et plus encore.
              </p>
              <Link href={dashboardLink}>
                <Button variant="primary" className="py-2 gap-2 group">
                  Accéder au tableau de bord
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </>
          )}
        </Card>
      </section>
    </div>
  );
}