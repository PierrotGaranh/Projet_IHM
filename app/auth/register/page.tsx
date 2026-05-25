'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'firstName' || e.target.name === 'lastName') {
      value = value.slice(0, 50);
    } else if (e.target.name === 'email') {
      value = value.slice(0, 100);
    } else if (e.target.name === 'phone') {
      value = value.slice(0, 20);
    } else if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      value = value.slice(0, 100);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const nameRegex = /^[A-Za-zÀ-ÿ\s-]{1,50}$/;
    if (!nameRegex.test(formData.firstName)) return setError('Le prénom ne doit contenir que des lettres, espaces ou tirets (max 50)');
    if (!nameRegex.test(formData.lastName)) return setError('Le nom ne doit contenir que des lettres, espaces ou tirets (max 50)');
    if (!formData.email.includes('@') || formData.email.length > 100) return setError('Email invalide (max 100)');
    if (formData.password.length < 6 || formData.password.length > 100) return setError('Le mot de passe doit contenir entre 6 et 100 caractères');
    if (formData.password !== formData.confirmPassword) return setError('Les mots de passe ne correspondent pas');
    if (formData.phone && !/^[\d+\s-]{10,20}$/.test(formData.phone)) return setError('Téléphone invalide (10 à 20 chiffres, espaces, +, -)');

    setIsLoading(true);
    const result = await register(formData.email, formData.password, formData.firstName, formData.lastName, formData.phone);
    if (result.success) {
      toast({ variant: 'success', title: 'Inscription réussie', description: 'Bienvenue sur ParkHub !' });
      router.push('/dashboard');
    } else {
      setError(result.error || 'Inscription échouée');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">P</div>
          <h1 className="text-2xl font-bold text-foreground">ParkHub</h1>
        </div>
        <p className="text-muted-foreground">Créer un nouveau compte</p>
      </div>

      <div className="card-base p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><label className="label-base">Nom <span className="text-destructive">*</span></label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-base w-full" required maxLength={50} /></div>
          <div className="space-y-2"><label className="label-base">Prénom <span className="text-destructive">*</span></label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-base w-full" required maxLength={50} /></div>
          <div className="space-y-2"><label className="label-base">Email <span className="text-destructive">*</span></label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-base w-full" required maxLength={100} /></div>
          <div className="space-y-2"><label className="label-base">Téléphone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-base w-full" maxLength={20} /></div>
          <div className="space-y-2"><label className="label-base">Mot de passe <span className="text-destructive">*</span></label><input type="password" name="password" value={formData.password} onChange={handleChange} className="input-base w-full" required maxLength={100} /></div>
          <div className="space-y-2"><label className="label-base">Confirmer le mot de passe <span className="text-destructive">*</span></label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-base w-full" required maxLength={100} /></div>
          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive" role="alert">{error}</div>}
          <button type="submit" disabled={isLoading} className="btn-primary w-full cursor-pointer">{isLoading ? <LoadingDots /> : "S'inscrire"}</button>
        </form>

        <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border" /><span className="text-sm text-muted-foreground">ou</span><div className="flex-1 h-px bg-border" /></div>
        <p className="text-center text-sm text-muted-foreground">Vous avez un compte ? <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold">Se connecter</Link></p>
      </div>
      <p className="text-center text-xs text-muted-foreground">Application de gestion de parking réservé</p>
    </div>
  );
}