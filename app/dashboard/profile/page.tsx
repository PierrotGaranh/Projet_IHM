'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { Lock, X } from 'lucide-react';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [vehiclePlates, setVehiclePlates] = useState<string[]>(user?.vehiclePlates?.length ? user.vehiclePlates : ['']);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    const nameRegex = /^[A-Za-zÀ-ÿ\s-]{1,50}$/;
    if (name === 'firstName' || name === 'lastName') {
      if (!value) return 'Ce champ est requis';
      if (!nameRegex.test(value)) return 'Lettres, espaces ou tirets (max 50)';
    }
    if (name === 'phone' && value && !/^[\d+\s-]{10,20}$/.test(value)) return 'Téléphone invalide (10-20 chiffres, +, -, espace)';
    if (name === 'plate' && value && !/^[A-Za-z0-9\s-]{1,15}$/.test(value)) return 'Plaque invalide (lettres, chiffres, -, espace)';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'firstName' || e.target.name === 'lastName') value = value.slice(0, 50);
    else if (e.target.name === 'phone') value = value.slice(0, 20);
    setFormData({ ...formData, [e.target.name]: value });
    const error = validateField(e.target.name, value);
    setFieldErrors(prev => ({ ...prev, [e.target.name]: error }));
  };

  const addPlate = () => setVehiclePlates([...vehiclePlates, '']);
  const removePlate = (idx: number) => setVehiclePlates(vehiclePlates.filter((_, i) => i !== idx));
  const updatePlate = (idx: number, value: string) => {
    const newPlates = [...vehiclePlates];
    newPlates[idx] = value.slice(0, 15);
    setVehiclePlates(newPlates);
    const error = validateField('plate', value);
    setFieldErrors(prev => ({ ...prev, [`plate_${idx}`]: error }));
  };

  const handleSave = () => {
    setMessage('');
    const errors: Record<string, string> = {};
    errors.firstName = validateField('firstName', formData.firstName);
    errors.lastName = validateField('lastName', formData.lastName);
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
    setIsSaving(true);
    const filteredPlates = vehiclePlates.filter(p => p.trim() !== '');
    const success = updateProfile({ ...formData, vehiclePlates: filteredPlates });
    if (success) {
      setMessage('Profil mis à jour avec succès !');
      toast({ variant: 'success', title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
      setIsEditing(false);
    } else {
      setFieldErrors({ global: 'Erreur lors de la mise à jour du profil' });
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    });
    setVehiclePlates(user?.vehiclePlates?.length ? user.vehiclePlates : ['']);
    setIsEditing(false);
    setMessage('');
    setFieldErrors({});
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
      </div>

      <div className="card-base p-8 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstName[0]}{user?.lastName[0]}
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
          </div>
        </div>

        {message && <div className="p-4 rounded-lg text-sm bg-secondary/10 border border-secondary/20 text-secondary">{message}</div>}
        {fieldErrors.global && <div className="p-4 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">{fieldErrors.global}</div>}

        <div className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground text-lg">Informations de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="label-base">Prénom</label>
                {isEditing ? (
                  <>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className={`input-base w-full ${fieldErrors.firstName ? 'border-destructive' : ''}`} maxLength={50} />
                    {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName}</p>}
                  </>
                ) : (
                  <p className="text-foreground py-2">{user?.firstName}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="label-base">Nom</label>
                {isEditing ? (
                  <>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className={`input-base w-full ${fieldErrors.lastName ? 'border-destructive' : ''}`} maxLength={50} />
                    {fieldErrors.lastName && <p className="text-xs text-destructive">{fieldErrors.lastName}</p>}
                  </>
                ) : (
                  <p className="text-foreground py-2">{user?.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="label-base">Email</label>
                <p className="text-muted-foreground py-2">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <label className="label-base">Téléphone</label>
                {isEditing ? (
                  <>
                    <input name="phone" value={formData.phone} onChange={handleChange} className={`input-base w-full ${fieldErrors.phone ? 'border-destructive' : ''}`} maxLength={20} />
                    {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
                  </>
                ) : (
                  <p className="text-foreground py-2">{user?.phone || 'Non renseigné'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground text-lg">Informations véhicule</h2>
            {isEditing ? (
              <div className="space-y-2">
                {vehiclePlates.map((plate, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input type="text" value={plate} onChange={e => updatePlate(idx, e.target.value)} placeholder="ex: AB-123-CD" className={`input-base w-full ${fieldErrors[`plate_${idx}`] ? 'border-destructive' : ''}`} maxLength={15} />
                      {fieldErrors[`plate_${idx}`] && <p className="text-xs text-destructive">{fieldErrors[`plate_${idx}`]}</p>}
                    </div>
                    {idx > 0 && <button type="button" onClick={() => removePlate(idx)} className="text-destructive hover:text-destructive/80 mt-1"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
                <button type="button" onClick={addPlate} className="text-sm text-primary hover:underline">+ Ajouter une plaque</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.vehiclePlates?.length ? user.vehiclePlates.map((plate, idx) => <span key={idx} className="bg-muted px-2 py-1 rounded text-sm">{plate}</span>) : <p className="text-foreground py-2">Non renseignée</p>}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-semibold text-foreground text-lg">Compte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Type de compte</p><p className="font-semibold capitalize">{user?.role === 'admin' ? 'Administrateur' : 'Utilisateur régulier'}</p></div>
              <div><p className="text-muted-foreground">Inscrit depuis</p><p className="font-semibold">{user?.createdAt && new Date(user.createdAt).toLocaleDateString('fr-FR')}</p></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-border">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex-1 cursor-pointer">Modifier le profil</button>
          ) : (
            <>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1 cursor-pointer">{isSaving ? <LoadingDots /> : 'Enregistrer'}</button>
              <button onClick={handleCancel} className="btn-secondary flex-1 cursor-pointer">Annuler</button>
            </>
          )}
        </div>
      </div>

      <div className="card-base p-6 border-l-4 border-l-accent bg-accent/5 space-y-3">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 mt-1" />
          <div><h3 className="font-semibold text-foreground">Sécurité</h3><p className="text-sm text-muted-foreground">Votre mot de passe est sécurisé et crypté. Vous pouvez le modifier en contactant le support.</p></div>
        </div>
      </div>
    </div>
  );
}