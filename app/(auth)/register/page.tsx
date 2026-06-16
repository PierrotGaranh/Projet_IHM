'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { AppIcon } from '@/components/atoms/AppIcon';
import { Card } from '@/components/atoms/Card';
import { RegisterStepper } from '@/components/organisms/RegisterStepper';
import { useIsMobile } from '@/hooks/use-mobile';

function RegisterPageContent() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = async (formData: any) => {
    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.vehiclePlates.filter((p: string) => p.trim() !== '')
    );
    if (result.success) {
      sessionStorage.removeItem('registerForm');
      toast({ variant: 'success', title: 'Inscription réussie', description: 'Bienvenue sur ParkHub !' });
      router.push('/home');
    } else {
      throw new Error(result.error || 'L\'inscription a échoué');
    }
  };

  return (
    <div className={`space-y-8 max-w-md mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-8'}`}>
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <AppIcon className="w-10 h-10"/>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground`}>ParkHub</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">Créer un nouveau compte</p>
      </div>
      <Card className={`${isMobile ? 'p-5' : 'p-6 md:p-8'} space-y-6`}>
        <RegisterStepper onSubmit={handleSubmit} />
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Vous avez un compte ? <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">Se connecter</Link>
        </p>
      </Card>
      <p className="text-center text-xs text-muted-foreground">Application de gestion de parking réservé</p>
    </div>
  );
}

export default function RegisterPage() { return <Suspense fallback={null}><RegisterPageContent /></Suspense>; }