import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { CompleteProfile, Profile, OrganizationProfile, UserSkill, UserBadge } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: CompleteProfile | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CompleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier la session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      // Récupérer le profil de base
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Vérification stricte de la cohérence des données
      if (profileData.id !== userId) {
        console.error("[fetchProfile] Incohérence détectée : le profil récupéré ne correspond pas à l'utilisateur connecté");
        toast.error("Erreur de cohérence des données. Veuillez vous reconnecter.");
        await signOut();
        return;
      }

      // Vérifier si c'est un profil d'organisation
      let organizationData = null;
      const isOrganization = user?.user_metadata?.is_organization === true;
      
      if (isOrganization) {
        // Récupérer les données de l'organisation
        const { data: orgData, error: orgError } = await supabase
          .from("organization_profiles")
          .select("*, sector:organization_sectors(*)")
          .eq("user_id", userId)
          .single();
          
        if (orgError && orgError.code !== "PGRST116") {
          console.error("[fetchProfile] Erreur lors de la récupération du profil d'organisation:", orgError);
          toast.error("Erreur lors de la récupération du profil d'organisation");
        } else if (orgData) {
          organizationData = orgData;
        }
      }

      // Récupérer les compétences de l'utilisateur
      const { data: skillsData } = await supabase
        .from("user_skills")
        .select("*, skill:skills(*)")
        .eq("user_id", userId);
        
      const skills = skillsData || [];
      
      // Récupérer les badges de l'utilisateur
      const { data: badgesData } = await supabase
        .from("user_badges")
        .select("*, badge:badges(*)")
        .eq("user_id", userId);
        
      const badges = badgesData || [];

      // Mapping vers l'interface CompleteProfile
      const firstName = profileData?.first_name ?? '';
      const lastName = profileData?.last_name ?? '';
      const city = profileData?.city ?? '';
      const postalCode = profileData?.postal_code ?? '';
      
      const mappedProfile: CompleteProfile = {
        ...profileData,
        is_organization: isOrganization,
        organization: organizationData,
        skills: skills as UserSkill[],
        badges: badges as UserBadge[],
        
        // Propriétés synthétiques
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
        avatar: profileData?.profile_picture_url ?? undefined,
        location: city && postalCode ? `${city} (${postalCode})` : city || postalCode || '',
        email: user?.email ?? '',
        role: isOrganization ? 'organization' : 'volunteer',
      };

      setProfile(mappedProfile);
    } catch (error) {
      console.error("[fetchProfile] Erreur lors de la récupération du profil:", error);
      toast.error("Erreur lors de la récupération du profil");
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
