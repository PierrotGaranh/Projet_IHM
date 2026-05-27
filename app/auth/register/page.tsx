'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { PasswordInput } from '@/components/password-input';
import { X } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [vehiclePlates, setVehiclePlates] = useState(['']);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'firstName' || e.target.name === 'lastName') value = value.slice(0, 50);
    else if (e.target.name === 'email') value = value.slice(0, 100);
    else if (e.target.name === 'phone') value = value.slice(0, 20);
    else if (e.target.name === 'password') value = value.slice(0, 100);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const addPlate = () => setVehiclePlates([...vehiclePlates, '']);
  const removePlate = (idx: number) => setVehiclePlates(vehiclePlates.filter((_, i) => i !== idx));
  const updatePlate = (idx: number, value: string) => {
    const newPlates = [...vehiclePlates];
    newPlates[idx] = value.slice(0, 15);
    setVehiclePlates(newPlates);
  };

  const validateField = (name: string, value: string): string => {
    const nameRegex = /^[A-Za-zÀ-ÿ\s-]{1,50}$/;
    if (name === 'firstName' || name === 'lastName') {
      if (!value) return 'Ce champ est requis';
      if (!nameRegex.test(value)) return 'Lettres, espaces ou tirets (max 50)';
    }
    if (name === 'email') {
      if (!value) return 'Email requis';
      if (!value.includes('@') || value.length > 100) return 'Email invalide';
    }
    if (name === 'password') {
      if (!value) return 'Mot de passe requis';
      if (value.length < 6 || value.length > 100) return '6 à 100 caractères';
    }
    if (name === 'phone' && value && !/^[\d+\s-]{10,20}$/.test(value)) return 'Téléphone invalide (10-20 chiffres, +, -, espace)';
    if (name === 'plate' && value && !/^[A-Za-z0-9\s-]{1,15}$/.test(value)) return 'Plaque invalide (lettres, chiffres, -, espace)';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errors: Record<string, string> = {};
    errors.firstName = validateField('firstName', formData.firstName);
    errors.lastName = validateField('lastName', formData.lastName);
    errors.email = validateField('email', formData.email);
    errors.password = validateField('password', formData.password);
    if (formData.phone) errors.phone = validateField('phone', formData.phone);
    vehiclePlates.forEach((plate, idx) => {
      if (plate) {
        const err = validateField('plate', plate);
        if (err) errors[`plate_${idx}`] = err;
      }
    });
    if (Object.values(errors).some(e => e)) {
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true);
    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phone,
      vehiclePlates.filter(p => p.trim() !== '')
    );
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
          <div className="space-y-1">
            <label className="label-base">Nom <span className="text-destructive">*</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`input-base w-full ${fieldErrors.lastName ? 'border-destructive' : ''}`} placeholder="ex: Dupont" required maxLength={50} />
            {fieldErrors.lastName && <p className="text-xs text-destructive">{fieldErrors.lastName}</p>}
          </div>
          <div className="space-y-1">
            <label className="label-base">Prénom <span className="text-destructive">*</span></label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`input-base w-full ${fieldErrors.firstName ? 'border-destructive' : ''}`} placeholder="ex: Jean" required maxLength={50} />
            {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName}</p>}
          </div>
          <div className="space-y-1">
            <label className="label-base">Email <span className="text-destructive">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-base w-full ${fieldErrors.email ? 'border-destructive' : ''}`} placeholder="ex: jean.dupont@email.com" required maxLength={100} />
            {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-1">
            <label className="label-base">Téléphone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input-base w-full ${fieldErrors.phone ? 'border-destructive' : ''}`} placeholder="ex: +33612345678" maxLength={20} />
            {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
          </div>
          <div className="space-y-2">
            <label className="label-base">Plaques d'immatriculation</label>
            {vehiclePlates.map((plate, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input type="text" value={plate} onChange={e => updatePlate(idx, e.target.value)} placeholder="ex: AB-123-CD" className={`input-base w-full ${fieldErrors[`plate_${idx}`] ? 'border-destructive' : ''}`} />
                  {fieldErrors[`plate_${idx}`] && <p className="text-xs text-destructive">{fieldErrors[`plate_${idx}`]}</p>}
                </div>
                {idx > 0 && <button type="button" onClick={() => removePlate(idx)} className="text-destructive hover:text-destructive/80 mt-1"><X className="w-4 h-4" /></button>}
              </div>
            ))}
            <button type="button" onClick={addPlate} className="text-sm text-primary hover:underline">+ Ajouter une plaque</button>
          </div>
          <PasswordInput
            name="password"
            label="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            required
            placeholder="********"
            maxLength={100}
          />
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