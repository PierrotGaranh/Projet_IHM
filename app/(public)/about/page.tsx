import { Card } from '@/components/atoms/Card';
import { Users, Target, Heart, Award, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          À propos de <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ParkHub</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Nous transformons la gestion de parking en une expérience simple, rapide et sécurisée.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary">
            <Zap className="w-4 h-4" />
            <span>Notre histoire</span>
          </div>
          <h2 className="text-3xl font-bold">La mobilité urbaine repensée</h2>
          <p className="text-muted-foreground">
            Fondé en 2025, ParkHub est né d'un constat simple : le stationnement en ville est
            chronophage, stressant et souvent inefficace. Nous avons développé une plateforme
            intelligente qui connecte les conducteurs aux places de parking disponibles en
            temps réel.
          </p>
          <p className="text-muted-foreground">
            Aujourd'hui, ParkHub c'est plus de 2 000 utilisateurs actifs et 150 places de parking
            gérées dans toute la région parisienne.
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
          <div className="text-6xl font-bold text-primary mb-2">2025</div>
          <p className="text-muted-foreground">Année de création</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Nos valeurs</h2>
          <p className="text-muted-foreground">Ce qui nous guide au quotidien</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Simplicité</h3>
            <p className="text-muted-foreground text-sm">Une interface intuitive qui rend la réservation accessible à tous.</p>
          </Card>
          <Card className="p-6 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
            <p className="text-muted-foreground text-sm">Vos données et transactions sont protégées par les meilleures technologies.</p>
          </Card>
          <Card className="p-6 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Écologie</h3>
            <p className="text-muted-foreground text-sm">Nous encourageons les mobilités douces et la réduction de l'empreinte carbone.</p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <Card className="p-6 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
          <p className="text-4xl font-bold text-primary">2k+</p>
          <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
        </Card>
        <Card className="p-6 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
          <p className="text-4xl font-bold text-secondary">150+</p>
          <p className="text-sm text-muted-foreground">Places de parking</p>
        </Card>
        <Card className="p-6 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
          <p className="text-4xl font-bold text-accent">24/7</p>
          <p className="text-sm text-muted-foreground">Support disponible</p>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center space-y-4">
        <Award className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">Une équipe passionnée</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Derrière ParkHub, ce sont des experts en mobilité, développeurs et designers
          unis par la même vision : fluidifier le stationnement en ville.
        </p>
      </div>
    </div>
  );
}