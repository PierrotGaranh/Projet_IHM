'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ProfileForm } from '@/components/organisms/ProfileForm';
import { InfoCard } from '@/components/molecules/InfoCard';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (data: any) => {
    const success = updateProfile(data);
    if (success) {
      toast({ variant: 'success', title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.'});
      setIsEditing(false);
      return true;
    } else {
      toast({ variant: 'error', title: 'Erreur', description: 'Erreur lors de la mise à jour du profil' });
      return false;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const initialData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    vehiclePlates: user?.vehiclePlates || [],
  };

  return (
    <div className={`${isMobile ? 'space-y-6' : 'space-y-8'} max-w-2xl`}>
      <div className="space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>Mon profil</h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <Card className={`${isMobile ? 'p-5' : 'p-8'} space-y-6`}>
        <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-6'}`}>
          <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white ${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="space-y-1">
            <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground`}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
          </div>
        </div>

        <ProfileForm
          key={isEditing ? 'edit' : 'view'}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          readonly={!isEditing}
        />

        {!isEditing && (
          <div className="pt-6 border-t border-border">
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              Modifier le profil
            </Button>
          </div>
        )}
      </Card>

      <InfoCard title="Sécurité" icon={<Lock className="w-5 h-5" />}>
        Votre mot de passe est sécurisé et crypté. Vous pouvez le modifier en contactant le support.
      </InfoCard>
    </div>
  );
}