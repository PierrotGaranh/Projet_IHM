'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.push(isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/auth/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  return null;
}
