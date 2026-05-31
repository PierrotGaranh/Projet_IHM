'use client';

import { useToast } from '@/hooks/use-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/atoms/Toast';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  const getIcon = (variant?: string | null) => {
    switch (variant) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'destructive': return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return null;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const Icon = getIcon(variant);
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              {Icon && <div className="flex-shrink-0 mt-0.5">{Icon}</div>}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}