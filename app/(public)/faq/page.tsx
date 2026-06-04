import { ExpandableCard } from '@/components/molecules/ExpandableCard';

const faqs = [
  { q: "Comment réserver une place ?", a: "Connectez-vous, allez dans l'onglet 'Réserver', sélectionnez une place disponible et choisissez vos horaires." },
  { q: "Puis-je annuler une réservation ?", a: "Oui, depuis l'écran 'Mes réservations', cliquez sur 'Annuler' tant que la réservation n'a pas commencé." },
  { q: "Quels sont les modes de paiement ?", a: "Nous acceptons les cartes bancaires (Visa, Mastercard) et certains portefeuilles électroniques." },
  { q: "Y a-t-il des frais cachés ?", a: "Non, le prix affiché est le prix final. Les taxes sont incluses." },
  { q: "Comment contacter le support ?", a: "Envoyez un email à support@parkhub.com ou utilisez notre formulaire de contact." },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Foire aux questions
        </h1>
        <p className="text-muted-foreground">Trouvez rapidement des réponses à vos questions</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <ExpandableCard key={idx} title={faq.q}>
            {faq.a}
          </ExpandableCard>
        ))}
      </div>

      <div className="p-6 text-center border-0 bg-white/80 dark:bg-slate-800/80 shadow-md rounded-lg">
        <p className="text-muted-foreground">
          Vous n'avez pas trouvé votre réponse ?{' '}
          <a href="/contact" className="text-primary font-semibold hover:underline">Contactez-nous</a>
        </p>
      </div>
    </div>
  );
}