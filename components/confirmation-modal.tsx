'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { LoadingDots } from '@/components/loading-dots';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir vous déconnecter ?',
  children,
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [onTreatment, setOnTreatment] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = async () => {
    if (onTreatment) return;
    setOnTreatment(true);
    try {
      await onConfirm();
    } finally {
      setOnTreatment(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-card rounded-xl shadow-2xl p-6 max-w-md w-full border border-border">
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        {message && <p className="text-muted-foreground mb-4">{message}</p>}
        {children && <div className="mb-6">{children}</div>}
        <div className="flex flex-row gap-3">
          {onTreatment ? (
            <button disabled className="btn-primary flex-1 inline-flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"><span>Confirmation</span><LoadingDots /></button>
          ) : (
            <button onClick={handleConfirm} className="btn-primary flex-1 cursor-pointer">Confirmer</button>
          )}
          <button onClick={onClose} disabled={onTreatment} className={`btn-secondary flex-1 cursor-pointer ${onTreatment ? 'opacity-50 cursor-not-allowed' : ''}`}>Annuler</button>
        </div>
      </div>
    </div>,
    document.body
  );
}