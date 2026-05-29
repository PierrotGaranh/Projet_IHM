'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingDots } from '@/components/loading-dots';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { getStore } from '@/lib/store';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [settings, setSettings] = useState({
    parkingName: 'ParkHub Central',
    totalLevels: 5,
    openingHour: '00:00',
    closingHour: '23:59',
    maintenanceDay: 'Sunday',
    contactEmail: 'admin@parkhub.com',
    phoneNumber: '+33612345678',
  });
  const [originalSettings, setOriginalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setOriginalSettings(parsed);
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      sessionStorage.setItem('adminSettings', JSON.stringify(settings));
    }
  }, [settings, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsSaving(true);
    setMessage('');
    setTimeout(() => {
      setOriginalSettings(settings);
      setMessage('Paramètres sauvegardés avec succès !');
      toast({ variant: 'success', title: 'Paramètres sauvegardés', description: 'Les paramètres ont été mis à jour.' });
      setIsSaving(false);
      setIsEditMode(false);
      setTimeout(() => setMessage(''), 3000);
    }, 300);
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setIsEditMode(false);
    setMessage('');
  };

  const handleReset = () => {
    setIsResetting(true);
    try {
      const store = getStore();
      store.resetStore();
      toast({ variant: 'success', title: 'Réinitialisation réussie', description: 'Toutes les données ont été réinitialisées.' });
      setShowResetModal(false);
      setIsResetting(false);
      router.push('/auth/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue lors de la réinitialisation.' });
      setShowResetModal(false);
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configuration générale du système de parking</p>
      </div>

      <div className="card-base p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Informations générales</h2>
          <div className="space-y-4">
            <div><label className="label-base">Nom du parking</label>{isEditMode ? <input type="text" name="parkingName" value={settings.parkingName} onChange={handleChange} maxLength={100} className="input-base w-full" /> : <p className="text-foreground py-2">{settings.parkingName}</p>}</div>
            <div><label className="label-base">Nombre de niveaux</label>{isEditMode ? <select name="totalLevels" value={settings.totalLevels} onChange={handleChange} className="input-base w-full cursor-pointer">{Array.from({ length: 6 }, (_, i) => i + 3).map(l => <option key={l} value={l}>{l} niveaux</option>)}</select> : <p className="text-foreground py-2">{settings.totalLevels} niveaux</p>}</div>
            <div><label className="label-base">Email de contact</label>{isEditMode ? <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} maxLength={100} className="input-base w-full" /> : <p className="text-foreground py-2">{settings.contactEmail}</p>}</div>
            <div><label className="label-base">Téléphone</label>{isEditMode ? <input type="tel" name="phoneNumber" value={settings.phoneNumber} onChange={handleChange} maxLength={20} className="input-base w-full" /> : <p className="text-foreground py-2">{settings.phoneNumber}</p>}</div>
          </div>
        </div>

        <div className="pt-6 border-t border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Horaires d'ouverture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-base">Ouverture</label>{isEditMode ? <input type="time" name="openingHour" value={settings.openingHour} onChange={handleChange} className="input-base w-full" /> : <p className="text-foreground py-2">{settings.openingHour}</p>}</div>
            <div><label className="label-base">Fermeture</label>{isEditMode ? <input type="time" name="closingHour" value={settings.closingHour} onChange={handleChange} className="input-base w-full" /> : <p className="text-foreground py-2">{settings.closingHour}</p>}</div>
          </div>
          <div><label className="label-base">Jour de maintenance</label>{isEditMode ? <select name="maintenanceDay" value={settings.maintenanceDay} onChange={handleChange} className="input-base w-full cursor-pointer">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day} value={day}>{day === 'Monday' ? 'Lundi' : day === 'Tuesday' ? 'Mardi' : day === 'Wednesday' ? 'Mercredi' : day === 'Thursday' ? 'Jeudi' : day === 'Friday' ? 'Vendredi' : day === 'Saturday' ? 'Samedi' : 'Dimanche'}</option>)}</select> : <p className="text-foreground py-2">{settings.maintenanceDay === 'Monday' ? 'Lundi' : settings.maintenanceDay === 'Tuesday' ? 'Mardi' : settings.maintenanceDay === 'Wednesday' ? 'Mercredi' : settings.maintenanceDay === 'Thursday' ? 'Jeudi' : settings.maintenanceDay === 'Friday' ? 'Vendredi' : settings.maintenanceDay === 'Saturday' ? 'Samedi' : 'Dimanche'}</p>}</div>
        </div>

        <div className="pt-6 border-t border-border space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tarification (à titre informatif)</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-border"><span className="text-muted-foreground">Place Compact</span><span className="font-semibold">2€/heure</span></div>
            <div className="flex justify-between py-3 border-b border-border"><span className="text-muted-foreground">Place Standard</span><span className="font-semibold">3€/heure</span></div>
            <div className="flex justify-between py-3"><span className="text-muted-foreground">Place Premium</span><span className="font-semibold">5€/heure</span></div>
          </div>
        </div>

        {message && <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 text-sm text-secondary">{message}</div>}

        {isEditMode && (
          <div className="pt-6 border-t border-border flex gap-3">
            <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1 cursor-pointer">{isSaving ? <LoadingDots /> : 'Enregistrer'}</button>
            <button onClick={handleCancel} className="btn-secondary flex-1 cursor-pointer">Annuler</button>
          </div>
        )}
        {!isEditMode && (
          <div className="pt-6 border-t border-border">
            <button onClick={() => setIsEditMode(true)} className="btn-primary w-full cursor-pointer">Modifier</button>
          </div>
        )}
      </div>

      <div className="card-base p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Informations système</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2"><span className="text-muted-foreground">Version</span><span className="font-semibold">v1.0.0</span></div>
          <div className="flex justify-between py-2 border-t border-border"><span className="text-muted-foreground">Dernière mise à jour</span><span className="font-semibold">{new Date().toLocaleDateString('fr-FR')}</span></div>
          <div className="flex justify-between py-2 border-t border-border"><span className="text-muted-foreground">Statut</span><span className="inline-flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary" /><span className="font-semibold">En ligne</span></span></div>
        </div>
      </div>

      <div className="card-base p-6 border-l-4 border-l-destructive bg-destructive/5 space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Zone dangereuse</h2>
        <p className="text-sm text-muted-foreground">Ces actions sont irréversibles. Procédez avec prudence.</p>
        <button onClick={() => setShowResetModal(true)} disabled={isResetting} className="btn-secondary text-sm border-destructive text-destructive hover:bg-destructive/10 w-full cursor-pointer">{isResetting ? <LoadingDots /> : 'Réinitialiser les données de la base de données'}</button>
      </div>

      <ConfirmationModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} onConfirm={handleReset} title="Réinitialiser toutes les données" message="Cette action supprimera définitivement toutes les réservations, utilisateurs et données. Êtes-vous absolument sûr ?" />
    </div>
  );
}