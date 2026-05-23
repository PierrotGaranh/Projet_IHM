'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir vous déconnecter ?',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg p-6 max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
        <div className="flex gap-3 pt-4">
          <button onClick={onConfirm} className="btn-primary flex-1 cursor-pointer">
            Confirmer
          </button>
          <button onClick={onClose} className="btn-secondary flex-1 cursor-pointer">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}