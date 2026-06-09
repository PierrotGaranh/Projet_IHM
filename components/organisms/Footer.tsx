'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SocialButtons } from '@/components/molecules/SocialButtons';
import { AppIcon } from '@/components/atoms/AppIcon';

const FOOTER_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'À propos' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/legal', label: 'Mentions' },
  { href: '/privacy', label: 'Confidentialité' },
  { href: '/terms', label: 'Conditions' },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  const BrandBlock = () => (
    <div className="flex items-center gap-3">
      <AppIcon className="w-8 h-8 md:w-7 md:h-7" />
      <a
        href="mailto:support@parkhub.com"
        className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm md:text-sm font-medium"
      >
        <Mail className="w-5 h-5" />
        support@parkhub.com
      </a>
    </div>
  );

  const LinksList = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      {FOOTER_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-muted-foreground hover:text-primary transition font-medium"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  return (
    <footer className="border-t border-border bg-background mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-5">
        <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-6">
          <BrandBlock />
          <LinksList className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm" />
          <div className="flex flex-wrap items-center justify-end gap-5">
            <SocialButtons />
            <span className="text-sm text-muted-foreground font-medium">
              &copy; {currentYear} ParkHub
            </span>
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-5">
          <BrandBlock />
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <SocialButtons />
            <span className="text-xs text-muted-foreground font-medium">
              &copy; {currentYear} ParkHub
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}