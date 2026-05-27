'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { getStore } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string, phone: string, vehiclePlates?: string[]) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => boolean;
  addVehiclePlate: (plate: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const store = getStore();
    const currentUser = store.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const store = getStore();
    const result = store.login(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
      if (typeof window !== 'undefined') {
        document.cookie = 'parkingAuth=true; path=/';
      }
      return { success: true, user: result.user };
    }
    
    return { success: false, error: result.error };
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone: string, vehiclePlates?: string[]) => {
    const store = getStore();
    const result = store.register(email, password, firstName, lastName, phone, vehiclePlates || []);
    
    if (result.success && result.user) {
      setUser(result.user);
      if (typeof window !== 'undefined') {
        document.cookie = 'parkingAuth=true; path=/';
      }
      return { success: true };
    }
    
    return { success: false, error: result.error };
  };

  const logout = () => {
    const store = getStore();
    store.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      document.cookie = 'parkingAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
  };

  const updateProfile = (updates: Partial<User>): boolean => {
    if (!user) return false;
    const store = getStore();
    const success = store.updateUser(user.id, updates);
    if (success) {
      const updatedUser = store.getUser(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return success;
  };

  const addVehiclePlate = (plate: string): boolean => {
    if (!user) return false;
    const store = getStore();
    const success = store.addVehiclePlate(user.id, plate);
    if (success) {
      const updatedUser = store.getUser(user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return success;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      addVehiclePlate,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}