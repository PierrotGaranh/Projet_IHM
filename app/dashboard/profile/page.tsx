'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { Lock } from 'lucide-react';
import { LoadingDots } from '@/components/loading-dots';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    vehiclePlate: user?.vehiclePlate || '',
  });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setMessage('');
    setIsSaving(true);
    const success = updateProfile(formData);
    if (success) {
      setMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
    } else {
      setMessage('Erreur lors de la mise à jour du profil');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      vehiclePlate: user?.vehiclePlate || '',
    });
    setIsEditing(false);
    setMessage('');
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

        {message && (
          <div className={`p-4 rounded-lg text-sm ${message.includes('succès') ? 'bg-secondary/10 border border-secondary/20 text-secondary' : 'bg-destructive/10 border border-destructive/20 text-destructive'}`}>
            {message}
          </div>
        )}

        <div className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground text-lg">Informations de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label-base">Prénom</label>
                {isEditing ? <input name="firstName" value={formData.firstName} onChange={handleChange} className="input-base w-full" /> : <p className="text-foreground py-2">{user?.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="label-base">Nom</label>
                {isEditing ? <input name="lastName" value={formData.lastName} onChange={handleChange} className="input-base w-full" /> : <p className="text-foreground py-2">{user?.lastName}</p>}
              </div>
              <div className="space-y-2">
                <label className="label-base">Email</label>
                <p className="text-muted-foreground py-2">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="label-base">Téléphone</label>
                {isEditing ? <input name="phone" value={formData.phone} onChange={handleChange} className="input-base w-full" /> : <p className="text-foreground py-2">{user?.phone || 'Non renseigné'}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground text-lg">Informations véhicule</h2>
            <div className="space-y-2">
              <label className="label-base">Immatriculation</label>
              {isEditing ? <input name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} placeholder="AB123CD" className="input-base w-full" /> : <p className="text-foreground py-2">{user?.vehiclePlate || 'Non renseignée'}</p>}
            </div>
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
            <button onClick={() => setIsEditing(true)} className="btn-primary flex-1 cursor-pointer ">Modifier le profil</button>
          ) : (
            <>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1 cursor-pointer ">{isSaving ? <LoadingDots /> : 'Enregistrer'}</button>
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