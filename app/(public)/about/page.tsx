import { AwardCard } from '@/components/molecules/AwardCard';
import { History } from '@/components/organisms/History';
import { ValuesGrid } from '@/components/organisms/ValuesGrid';
import { Users, Heart, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: 'Simplicité',
      description: 'Une interface intuitive qui rend la réservation accessible à tous.',
      iconBgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: 'Sécurité',
      description: 'Vos données et transactions sont protégées par les meilleures technologies.',
      iconBgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      icon: <Heart className="w-6 h-6 text-accent" />,
      title: 'Écologie',
      description: "Nous encourageons les mobilités douces et la réduction de l'empreinte carbone.",
      iconBgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          À propos de <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ParkHub</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Nous transformons la gestion de parking en une expérience simple, rapide et sécurisée.
        </p>
      </div>

      <History />

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Nos valeurs</h2>
          <p className="text-muted-foreground">Ce qui nous guide au quotidien</p>
        </div>
        <ValuesGrid values={values} />
      </div>

      <AwardCard />
    </div>
  );
}