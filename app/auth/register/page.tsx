'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { PasswordInput } from '@/components/password-input';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = sessionStorage.getItem('registerForm');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData);
      setVehiclePlates(parsed.vehiclePlates);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('registerForm', JSON.stringify({ formData, vehiclePlates }));
  }, [formData, vehiclePlates]);

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
    if (name === 'phone' && value && !/^[\d+\s-]{10,20}$/.test(value))
      return 'Téléphone invalide (10-20 chiffres, +, -, espace)';
    if (name === 'plate' && value && !/^[A-Za-z0-9\s-]{1,15}$/.test(value))
      return 'Plaque invalide (lettres, chiffres, -, espace)';
    return '';
  };

  const handleBlur = (name: string, value: string) => {
    const errorMsg = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === 'firstName' || name === 'lastName') value = value.slice(0, 50);
    else if (name === 'email') value = value.slice(0, 100);
    else if (name === 'phone') value = value.slice(0, 20);
    else if (name === 'password') value = value.slice(0, 100);
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addPlate = () => setVehiclePlates([...vehiclePlates, '']);
  const removePlate = (idx: number) => setVehiclePlates(vehiclePlates.filter((_, i) => i !== idx));
  const updatePlate = (idx: number, value: string) => {
    const newPlates = [...vehiclePlates];
    newPlates[idx] = value.slice(0, 15);
    setVehiclePlates(newPlates);
    if (fieldErrors[`plate_${idx}`]) setFieldErrors(prev => ({ ...prev, [`plate_${idx}`]: '' }));
  };
  const handlePlateBlur = (idx: number, value: string) => {
    const errorMsg = validateField('plate', value);
    if (errorMsg) setFieldErrors(prev => ({ ...prev, [`plate_${idx}`]: errorMsg }));
    else setFieldErrors(prev => ({ ...prev, [`plate_${idx}`]: '' }));
  };

  const isStepValid = () => {
    const errors: Record<string, string> = {};
    if (currentStep === 0) {
      errors.firstName = validateField('firstName', formData.firstName);
      errors.lastName = validateField('lastName', formData.lastName);
    } else if (currentStep === 1) {
      errors.email = validateField('email', formData.email);
      if (formData.phone) errors.phone = validateField('phone', formData.phone);
      vehiclePlates.forEach((plate, idx) => {
        if (plate) {
          const err = validateField('plate', plate);
          if (err) errors[`plate_${idx}`] = err;
        }
      });
    } else if (currentStep === 2) {
      errors.password = validateField('password', formData.password);
    }
    setFieldErrors(errors);
    return Object.values(errors).every(e => !e);
  };

  const nextStep = () => {
    if (isStepValid()) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

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
      sessionStorage.removeItem('registerForm');
      toast({ variant: 'success', title: 'Inscription réussie', description: 'Bienvenue sur ParkHub !' });
      router.push('/dashboard');
    } else {
      setError(result.error || 'Inscription échouée');
    }
    setIsLoading(false);
  };

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-8 max-w-md mx-auto px-4 py-8">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            P
          </div>
          <h1 className="text-2xl font-bold text-foreground">ParkHub</h1>
        </div>
        <p className="text-muted-foreground">Créer un nouveau compte</p>
        <div className="pt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span className={currentStep >= 0 ? 'text-primary font-medium' : ''}>Identité</span>
            <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Contact & véhicules</span>
            <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Sécurité</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Étape {currentStep + 1} sur {totalSteps}
          </p>
        </div>
      </div>

      <div className="card-base p-6 md:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="label-base">
                  Nom <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('lastName', e.target.value)}
                  className={`input-base w-full ${fieldErrors.lastName ? 'border-destructive' : ''}`}
                  placeholder="ex: Dupont"
                  required
                  maxLength={50}
                  autoFocus
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.lastName}</p>
                )}
                <p className="text-xs text-muted-foreground">Lettres, espaces ou tirets uniquement.</p>
              </div>
              <div className="space-y-1">
                <label className="label-base">
                  Prénom <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('firstName', e.target.value)}
                  className={`input-base w-full ${fieldErrors.firstName ? 'border-destructive' : ''}`}
                  placeholder="ex: Jean"
                  required
                  maxLength={50}
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.firstName}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="label-base">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  className={`input-base w-full ${fieldErrors.email ? 'border-destructive' : ''}`}
                  placeholder="ex: jean.dupont@email.com"
                  required
                  maxLength={100}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="label-base">Téléphone (optionnel)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                  className={`input-base w-full ${fieldErrors.phone ? 'border-destructive' : ''}`}
                  placeholder="ex: +33612345678"
                  maxLength={20}
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>
                )}
                <p className="text-xs text-muted-foreground">Format international recommandé.</p>
              </div>
              <div className="space-y-2">
                <label className="label-base">Plaques d'immatriculation</label>
                {vehiclePlates.map((plate, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={plate}
                        onChange={(e) => updatePlate(idx, e.target.value)}
                        onBlur={(e) => handlePlateBlur(idx, e.target.value)}
                        placeholder="ex: AB123CD"
                        className={`input-base w-full ${fieldErrors[`plate_${idx}`] ? 'border-destructive' : ''}`}
                      />
                      {fieldErrors[`plate_${idx}`] && (
                        <p className="text-xs text-destructive mt-1">{fieldErrors[`plate_${idx}`]}</p>
                      )}
                    </div>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removePlate(idx)}
                        className="text-destructive hover:text-destructive/80 mt-1"
                        aria-label="Supprimer cette plaque"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPlate}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  + Ajouter une plaque
                </button>
                <p className="text-xs text-muted-foreground">
                  Vous pourrez en ajouter d'autres plus tard.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <PasswordInput
                name="password"
                label="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => handleBlur('password', e.target.value)}
                error={fieldErrors.password}
                required
                placeholder="********"
                maxLength={100}
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Le mot de passe doit contenir :</p>
                <ul className="list-disc list-inside ml-2">
                  <li>6 à 100 caractères</li>
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-4 pt-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary cursor-pointer flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
            )}
            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary cursor-pointer flex items-center gap-2 ml-auto"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? <LoadingDots /> : <>
                  <CheckCircle className="w-4 h-4" /> S'inscrire
                </>}
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Vous avez un compte ?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Application de gestion de parking réservé
      </p>
    </div>
  );
}