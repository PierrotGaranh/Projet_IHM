import { Card } from '@/components/atoms/Card';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Contactez</span> notre équipe
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Une question ? Un projet ? Nous sommes à votre écoute.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all group">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Par email</h2>
          <p className="text-muted-foreground mb-4">Pour toute demande générale ou support</p>
          <a href="mailto:support@parkhub.com" className="text-primary font-medium hover:underline">
            support@parkhub.com
          </a>
        </Card>

        <Card className="p-8 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md hover:shadow-lg transition-all group">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Support professionnel</h2>
          <p className="text-muted-foreground mb-4">Pour les entreprises et les partenaires</p>
          <a href="mailto:pro@parkhub.com" className="text-secondary font-medium hover:underline">
            pro@parkhub.com
          </a>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
          <Phone className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium">Téléphone</p>
            <a href="tel:+33123456789" className="text-muted-foreground hover:text-primary">+33 1 23 45 67 89</a>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
          <MapPin className="w-8 h-8 text-secondary" />
          <div>
            <p className="font-medium">Adresse</p>
            <p className="text-muted-foreground">123 Avenue de la République, 75011 Paris</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-0 bg-white/80 dark:bg-slate-800/80 shadow-md">
          <Clock className="w-8 h-8 text-accent" />
          <div>
            <p className="font-medium">Horaires</p>
            <p className="text-muted-foreground">Lun–Ven : 9h – 18h</p>
          </div>
        </Card>
      </div>
    </div>
  );
}