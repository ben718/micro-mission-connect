import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isOrganization: boolean;
}

interface SignInData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Vérifier la session active
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setState(prev => ({ ...prev, user: session?.user ?? null, loading: false }));
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
        setState(prev => ({ ...prev, error: "Erreur de session", loading: false }));
      }
    };

    checkSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, user: session?.user ?? null }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: authData.user?.id,
            first_name: data.firstName,
            last_name: data.lastName,
          },
        ]);

      if (profileError) throw profileError;

      // Si c'est une organisation, créer le profil organisation
      if (data.isOrganization) {
        const { error: orgError } = await supabase
          .from("organization_profiles")
          .insert([
            {
              user_id: authData.user?.id,
              organization_name: `${data.firstName} ${data.lastName}`,
            },
          ]);

        if (orgError) throw orgError;
      }

      toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error("Erreur lors de l'inscription");
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast.success("Connexion réussie !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error("Erreur lors de la connexion");
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Déconnexion réussie !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error("Erreur lors de la déconnexion");
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Email de réinitialisation envoyé !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation");
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}; 