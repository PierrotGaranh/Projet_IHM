'use client';

import Link from 'next/link';
import { Mail, ChevronUp } from 'lucide-react';
import { SocialButtons } from '@/components/molecules/SocialButtons';
import { AppIcon } from '@/components/atoms/AppIcon';
import { useState } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isOpen && (
          <div className="py-12">
            <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
              <div className="flex-0">
                <div className="flex items-center gap-2 mb-4">
                  <AppIcon className="w-6 h-6" />
                  <h3 className="text-lg font-bold text-foreground">ParkHub</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                  Solution complète de gestion et réservation de places de parking.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@parkhub.com" className="hover:text-primary transition">
                    support@parkhub.com
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 md:contents">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Liens</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/" className="text-muted-foreground hover:text-primary transition">Accueil</Link></li>
                    <li><Link href="/about" className="text-muted-foreground hover:text-primary transition">À propos</Link></li>
                    <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition">FAQ</Link></li>
                    <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Légal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/legal" className="text-muted-foreground hover:text-primary transition">Mentions légales</Link></li>
                    <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition">Politique de confidentialité</Link></li>
                    <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition">Conditions d'utilisation</Link></li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Suivez-nous</h4>
                <SocialButtons />
              </div>
            </div>
          </div>
        )}

        <div className={!isOpen ? 'py-6' : 'pb-6'}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group w-full pt-6 border-t border-border text-center text-xs text-muted-foreground transition-all duration-300 cursor-pointer focus:outline-none"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <div className="flex items-center justify-center gap-2">
              <p>&copy; {currentYear} ParkHub. Tous droits réservés.</p>
              <ChevronUp
                className={`w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  isOpen ? 'rotate-0' : 'rotate-180'
                }`}
              />
            </div>
            <div className="mt-2 h-px w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </button>
        </div>
      </div>
    </footer>
  );
}