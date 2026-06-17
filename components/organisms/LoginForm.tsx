'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'loginForm';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
      } catch {}
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
  }, [email]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Échec de la connexion');
      }
      sessionStorage.removeItem(STORAGE_KEY);
      toast({
        variant: 'success',
        title: 'Connexion réussie',
        description: `Bienvenue ${result.user?.firstName}`,
      });
      const redirectTo = result.user?.role === 'admin' ? '/admin' : '/home';
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <div className='flex gap-2'><AlertTriangle className='w-4 h-4'/><span>{error}</span></div>
        </div>
      )}
      <Button
        variant="primary"
        type="submit"
        isLoading={isLoading}
        loadingText="Connexion"
        className="w-full"
        disabled={!email.trim() || !password.trim()}
      >
        Se connecter
      </Button>
    </form>
  );
}