
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { CompleteProfile } from "@/types/profile";
import { toast } from "sonner";
import { createContext, useContext, ReactNode } from "react";

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isOrganization?: boolean;
  organizationName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  profile: CompleteProfile | null;
  isLoading: boolean;
  loading: boolean;
  error: string;
  signUp: (data: SignUpData) => Promise<any>;
  signIn: (data: SignInData) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authData = useAuthData();
  
  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthData() {
  const queryClient = useQueryClient();

  // Get current session
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Get user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async (): Promise<CompleteProfile | null> => {
      if (!session?.user?.id) return null;

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      // Check if user has an organization profile
      const { data: orgProfile } = await supabase
        .from("organization_profiles")
        .select(`
          *,
          sector:sector_id(*)
        `)
        .eq("user_id", session.user.id)
        .single();

      return {
        ...profileData,
        is_organization: !!orgProfile,
        organization: orgProfile || undefined,
        email: session.user.email,
        avatar_url: profileData.profile_picture_url,
        is_association: !!orgProfile,
      } as CompleteProfile;
    },
    enabled: !!session?.user?.id,
  });

  const signUp = useMutation({
    mutationFn: async (data: SignUpData) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
          });

        if (profileError) throw profileError;

        // Create organization profile if needed
        if (data.isOrganization && data.organizationName) {
          const { error: orgError } = await supabase
            .from("organization_profiles")
            .insert({
              user_id: authData.user.id,
              organization_name: data.organizationName,
            });

          if (orgError) throw orgError;
        }
      }

      return authData;
    },
    onSuccess: () => {
      toast.success("Compte créé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const signIn = useMutation({
    mutationFn: async (data: SignInData) => {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      return authData;
    },
    onSuccess: () => {
      toast.success("Connexion réussie !");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Déconnexion réussie !");
      queryClient.clear();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Email de réinitialisation envoyé !");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return {
    user: session?.user || null,
    profile,
    isLoading,
    loading: isLoading,
    error: "",
    signUp: signUp.mutateAsync,
    signIn: signIn.mutateAsync,
    signOut: signOut.mutateAsync,
    resetPassword: resetPassword.mutateAsync,
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
