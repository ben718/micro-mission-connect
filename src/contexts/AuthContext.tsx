
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { SupabaseData } from '../lib/mappers';

interface AuthContextType {
  user: SupabaseData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    signup, 
    logout, 
    checkAuth 
  } = useAuthStore();

  const [initialized, setInitialized] = useState(false);

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setInitialized(true);
    };

    initAuth();
  }, [checkAuth]);

  // Attendre que la vérification d'authentification soit terminée
  if (!initialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
