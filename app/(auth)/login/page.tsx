'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { AppIcon } from '@/components/atoms/AppIcon'
import { Card } from '@/components/atoms/Card';
import { LoginForm } from '@/components/organisms/LoginForm';
import { useIsMobile } from '@/hooks/use-mobile';
import Loading from './loading';

function LoginPageContent() {
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-8 ${isMobile ? 'px-2' : ''}`}>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Link href="/" className="cursor-pointer"><AppIcon className="w-10 h-10"/></Link>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground`}>ParkHub</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">Connexion à votre compte</p>
      </div>
      <Card className={`${isMobile ? 'p-5' : 'p-8'} space-y-6`}>
        <div className="text-sm space-y-1 p-2 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="font-semibold text-secondary text-xs sm:text-sm">Comptes de démo :</p>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p><strong>User:</strong> user@example.com / password123</p>
            <p><strong>Admin:</strong> admin@example.com / admin123</p>
          </div>
        </div>
        <LoginForm />
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ? <Link href="/register" className="text-primary hover:text-primary/80 font-semibold">S'inscrire</Link>
        </p>
      </Card>
      <p className="text-center text-xs text-muted-foreground">Application de gestion de parking réservé</p>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<Loading />}><LoginPageContent /></Suspense>;
}