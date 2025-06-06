import { create } from 'zustand';
import { authService } from '../lib/supabase';
import { SupabaseData } from '../lib/mappers';

// Types
interface AuthState {
  user: SupabaseData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string, languages?: string[]) => Promise<{ success: boolean; error?: string }>;
  signupAssociation: (
    email: string, 
    password: string, 
    associationName: string,
    siret: string,
    description: string,
    address: string,
    city: string,
    postalCode: string,
    phone: string,
    category: string,
    contactName: string,
    contactRole: string,
    contactEmail?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  // Login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, session } = await authService.signIn(email, password);
      
      if (user && session) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return { success: true };
      } else {
        set({ 
          error: 'Échec de connexion. Vérifiez vos identifiants.', 
          isLoading: false 
        });
        return { 
          success: false, 
          error: 'Échec de connexion. Vérifiez vos identifiants.' 
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors de la connexion.';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  
  // Signup for volunteers
  signup: async (email: string, password: string, firstName: string, lastName: string, languages?: string[]) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, session } = await authService.signUpVolunteer(email, password, firstName, lastName, languages);
      
      if (user && session) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return { success: true };
      } else {
        set({ 
          error: 'Échec de l\'inscription. Veuillez réessayer.', 
          isLoading: false 
        });
        return { 
          success: false, 
          error: 'Échec de l\'inscription. Veuillez réessayer.' 
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription.';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  
  // Signup for associations
  signupAssociation: async (
    email: string, 
    password: string, 
    associationName: string,
    siret: string,
    description: string,
    address: string,
    city: string,
    postalCode: string,
    phone: string,
    category: string,
    contactName: string,
    contactRole: string,
    contactEmail?: string
  ) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, session } = await authService.signUpAssociation(
        email, 
        password, 
        associationName,
        siret,
        description,
        address,
        city,
        postalCode,
        phone,
        category,
        contactName,
        contactRole,
        contactEmail
      );
      
      if (user && session) {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return { success: true };
      } else {
        set({ 
          error: 'Échec de l\'inscription. Veuillez réessayer.', 
          isLoading: false 
        });
        return { 
          success: false, 
          error: 'Échec de l\'inscription. Veuillez réessayer.' 
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors de l\'inscription.';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },
  
  // Logout
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.signOut();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Une erreur est survenue lors de la déconnexion.', 
        isLoading: false 
      });
    }
  },
  
  // Check authentication status
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      const session = await authService.getCurrentSession();
      
      if (session) {
        const user = await authService.getCurrentUser();
        set({ 
          user, 
          isAuthenticated: !!user, 
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Une erreur est survenue lors de la vérification de l\'authentification.', 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
    }
  }
}));
