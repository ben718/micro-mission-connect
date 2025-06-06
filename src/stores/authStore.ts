
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'user' | 'association';
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  checkAuth: async () => {
    try {
      // Simuler la vérification de l'authentification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Pour la démo, on simule un utilisateur connecté
      const mockUser = {
        id: '1',
        email: 'jean.dupont@example.com',
        role: 'user' as const,
        name: 'Jean Dupont'
      };
      
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = {
        id: '1',
        email,
        role: 'user' as const,
        name: 'Jean Dupont'
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Échec de la connexion');
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
