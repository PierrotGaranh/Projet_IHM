import { ContactGrid } from '@/components/organisms/ContactGrid';
import { Mail, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const emails = [
    {
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: 'Par email',
      description: 'Pour toute demande générale ou support',
      email: 'support@parkhub.com',
      emailLabel: 'support@parkhub.com',
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-secondary" />,
      title: 'Support professionnel',
      description: 'Pour les entreprises et les partenaires',
      email: 'pro@parkhub.com',
      emailLabel: 'pro@parkhub.com',
    },
  ];

  const contactInfos = [
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      title: 'Téléphone',
      content: <a href="tel:+33123456789" className="text-muted-foreground hover:text-primary">+33 1 23 45 67 89</a>,
    },
    {
      icon: <MapPin className="w-8 h-8 text-secondary" />,
      title: 'Adresse',
      content: '123 Avenue de la République, 75011 Paris',
    },
    {
      icon: <Clock className="w-8 h-8 text-accent" />,
      title: 'Horaires',
      content: 'Lun - Ven : 9h - 18h',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 md:py-16 px-4 space-y-12 md:space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Contactez</span> notre équipe
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Une question ? Un projet ? Nous sommes à votre écoute.
        </p>
      </div>

      <ContactGrid emails={emails} contactInfos={contactInfos} />
    </div>
  );
}