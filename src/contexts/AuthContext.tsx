
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: 'user' | 'association';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, role?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler la vérification de l'authentification
    const checkAuth = async () => {
      try {
        // Simuler un délai de vérification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Pour la démo, on simule un utilisateur connecté
        const mockUser = {
          id: '1',
          email: 'jean.dupont@example.com',
          role: 'user' as const,
          name: 'Jean Dupont'
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // Simuler la connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email,
        role: 'user' as const,
        name: 'Jean Dupont'
      };
      setUser(mockUser);
    } catch (error) {
      throw new Error('Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (email: string, _password: string, role = 'user') => {
    setIsLoading(true);
    try {
      // Simuler l'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email,
        role: role as 'user' | 'association',
        name: 'Nouvel utilisateur'
      };
      setUser(mockUser);
    } catch (error) {
      throw new Error('Échec de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
