'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { AppIcon } from '@/components/atoms/AppIcon';
import { Card } from '@/components/atoms/Card';
import { RegisterStepper } from '@/components/organisms/RegisterStepper';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();

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
      throw new Error(result.error || 'Inscription échouée');
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto px-4 py-8">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <AppIcon  className="w-10 h-10"/>
          <h1 className="text-2xl font-bold text-foreground">ParkHub</h1>
        </div>
        <p className="text-muted-foreground">Créer un nouveau compte</p>
      </div>
      <Card className="p-6 md:p-8 space-y-6">
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