'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/atoms/Label';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showRequired?: boolean;
}

export function PasswordInput({ label, error, showRequired, className = '', id, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name || 'password';

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={inputId} showRequired={showRequired}>{label}</Label>}
      <div className="relative">
        <input id={inputId} type={showPassword ? 'text' : 'password'} className={`input-base w-full pr-10 ${error ? 'border-destructive' : ''} ${className}`} {...props} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground cursor-pointer" tabIndex={-1}>
          {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}