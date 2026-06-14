'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { Tarifaction } from '@/components/molecules/Tarifaction';
import { DangerZone } from '@/components/molecules/DangerZone';
import { SystemInfo } from '@/components/molecules/SystemInfo';
import { SettingsForm } from '@/components/organisms/SettingsForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { getStore } from '@/lib/store';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [settings, setSettings] = useState({
    parkingName: 'ParkHub Central',
    totalPlaces: 5,
    openingHour: '00:00',
    closingHour: '23:59',
    maintenanceDay: 'Sunday',
    contactEmail: 'admin@parkhub.com',
    phoneNumber: '+33612345678',
  });
  const [originalSettings, setOriginalSettings] = useState(settings);
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
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      sessionStorage.setItem('adminSettings', JSON.stringify(settings));
    }
  }, [settings, isEditMode]);

  const handleSave = async (newSettings: any) => {
    setSettings(newSettings);
    setOriginalSettings(newSettings);
    setMessage('Paramètres sauvegardés avec succès !');
    toast({ variant: 'success', title: 'Paramètres sauvegardés', description: 'Les paramètres ont été mis à jour.' });
    setIsEditMode(false);
    setTimeout(() => setMessage(''), 3000);
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
      
      toast({ variant: 'success', title: 'Réinitialisation réussie', description: 'Toutes les données ont été réinitialisées.'});
      setShowResetModal(false);
      router.push('/login');
    } catch (error) {
      toast({ variant: 'error', title: 'Erreur', description: 'Une erreur est survenue lors de la réinitialisation.',});
      setShowResetModal(false);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto">
      <div className="space-y-1 sm:space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>Paramètres</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>Configuration générale du système de parking</p>
      </div>

      <Card className={`${isMobile ? 'p-5' : 'p-8'} space-y-6`}>
        <SettingsForm
          initialSettings={settings}
          onSubmit={handleSave}
          onCancel={handleCancel}
          readonly={!isEditMode}
        />

        {message && (
          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20 text-sm text-secondary">
            {message}
          </div>
        )}

        {!isEditMode && (
          <div className="pt-6 border-t border-border">
            <Button variant="primary" onClick={() => setIsEditMode(true)} className="w-full">
              Modifier
            </Button>
          </div>
        )}

        <Tarifaction />
      </Card>

      <SystemInfo />

      <DangerZone
        title="Zone dangereuse"
        description="Ces actions sont irréversibles. Procédez avec prudence."
        action={
          <Button
            variant="secondary"
            onClick={() => setShowResetModal(true)}
            isLoading={isResetting}
            loadingText="Réinitialisation"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
          >
            Réinitialiser les données de la base de données
          </Button>
        }
      />

      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title="Réinitialiser toutes les données"
        message="Cette action supprimera définitivement toutes les réservations, utilisateurs et données. Êtes-vous absolument sûr ?"
        isDangerous={true}
      />
    </div>
  );
}