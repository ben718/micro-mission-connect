import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { Profile } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[AuthProvider] Initialisation...");
    
    // Configurer l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("[AuthProvider] État d'authentification changé:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("[AuthProvider] Utilisateur connecté, récupération du profil...");
          try {
            await fetchProfile(currentSession.user.id);
          } catch (error) {
            console.error("[AuthProvider] Erreur lors de la récupération du profil:", error);
          }
        } else {
          console.log("[AuthProvider] Aucun utilisateur connecté");
          setProfile(null);
        }

        setLoading(false);
        setIsLoading(false);
      }
    );

    // Vérifier la session existante
    console.log("[AuthProvider] Vérification de la session existante...");
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("[AuthProvider] Session récupérée:", currentSession ? "oui" : "non");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("[AuthProvider] Session existante, récupération du profil...");
        fetchProfile(currentSession.user.id).catch(error => {
          console.error("[AuthProvider] Erreur lors de la récupération du profil:", error);
        });
      }
      
      setLoading(false);
      setIsLoading(false);
    }).catch(error => {
      console.error("[AuthProvider] Erreur lors de la vérification de la session:", error);
      setLoading(false);
      setIsLoading(false);
    });

    return () => {
      console.log("[AuthProvider] Nettoyage...");
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return;
      }

      // Mapping vers l'interface Profile locale
      const profileData = data as any;
      const firstName = profileData?.first_name ?? '';
      const lastName = profileData?.last_name ?? '';
      
      const mappedProfile: Profile = {
        id: profileData?.id ?? '',
        first_name: firstName,
        last_name: lastName,
        is_association: profileData?.is_association ?? false,
        avatar_url: profileData?.avatar_url ?? undefined,
        bio: profileData?.bio ?? '',
        location: profileData?.location ?? '',
        website: profileData?.website ?? '',
        phone: profileData?.phone ?? '',
        // Propriétés synthétiques
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
        role: profileData?.is_association ? 'association' : 'benevole',
        avatar: profileData?.avatar_url ?? undefined,
        badges: profileData?.badges ?? [],
        skills: profileData?.skills ?? [],
        email: profileData?.email ?? user?.email ?? '',
        created_at: profileData?.created_at ?? '',
        updated_at: profileData?.updated_at ?? '',
      };
      
      setProfile(mappedProfile);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Connexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de connexion:", error.message);
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      navigate("/auth/confirmation");
    } catch (error: any) {
      console.error("Erreur d'inscription:", error.message);
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error.message);
      toast.error(error.message);
      throw error;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
