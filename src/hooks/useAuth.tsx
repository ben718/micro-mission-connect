
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { Profile, OrganizationProfile, AuthData } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  organizationProfile: OrganizationProfile | null;
  loading: boolean;
  isOrganization: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: AuthData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organizationProfile, setOrganizationProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Configuration de l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("[AuthProvider] Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchUserData(currentSession.user.id);
        } else {
          setProfile(null);
          setOrganizationProfile(null);
          setLoading(false);
        }
      }
    );

    // Vérification de la session existante
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Récupérer le profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      setProfile(profileData);

      // Vérifier s'il y a un profil d'organisation
      const { data: orgData, error: orgError } = await supabase
        .from("organization_profiles")
        .select(`
          *,
          organization_sectors (
            id,
            name,
            description
          )
        `)
        .eq("user_id", userId)
        .single();

      if (!orgError && orgData) {
        setOrganizationProfile(orgData);
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Connexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Erreur de connexion");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: AuthData) => {
    try {
      setLoading(true);
      
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Aucun utilisateur créé");

      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        });

      if (profileError) throw profileError;

      // Si c'est une organisation, créer le profil organisation
      if (data.role === 'organization' && data.organization_name) {
        const { error: orgError } = await supabase
          .from("organization_profiles")
          .insert({
            user_id: authData.user.id,
            organization_name: data.organization_name,
            description: data.organization_description,
            sector_id: data.sector_id,
          });

        if (orgError) throw orgError;
      }

      toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      navigate("/auth/confirmation");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setOrganizationProfile(null);
      setSession(null);
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success("Profil mis à jour");
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error("Erreur lors de la mise à jour du profil");
      throw error;
    }
  };

  const isOrganization = !!organizationProfile;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        organizationProfile,
        loading,
        isOrganization,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
