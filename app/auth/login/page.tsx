'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const redirectTo = result.user?.role === 'admin' ? '/admin' : '/dashboard';
        router.push(redirectTo);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            P
          </div>
          <h1 className="text-2xl font-bold text-foreground">ParkHub</h1>
        </div>
        <p className="text-muted-foreground">Connexion à votre compte</p>
      </div>

      {/* Form Card */}
      <div className="card-base p-8 space-y-6">
        {/* Demo credentials */}
        <div className="text-sm space-y-2 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="font-semibold text-secondary">Comptes de démo :</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>User:</strong> user@example.com / password123</p>
            <p><strong>Admin:</strong> admin@example.com / admin123</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="label-base">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="input-base w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="label-base">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base w-full"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte?{' '}
          <Link
            href="/auth/register"
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            S'inscrire
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        Application de gestion de parking réservé
      </p>
    </div>
  );
}
