'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title = 'Confirmation', message = 'Êtes-vous sûr de vouloir continuer ?', children }: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
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
          <Button variant="primary" onClick={handleConfirm} isLoading={isProcessing} loadingText="Confirmation" className="flex-1">Confirmer</Button>
          <Button variant="secondary" onClick={onClose} disabled={isProcessing} className="flex-1">Annuler</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}