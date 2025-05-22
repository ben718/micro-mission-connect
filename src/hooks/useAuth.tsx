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
            setProfile(null);
          } finally {
            setLoading(false);
            setIsLoading(false);
          }
        } else {
          console.log("[AuthProvider] Aucun utilisateur connecté");
          setProfile(null);
          setLoading(false);
          setIsLoading(false);
        }
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
          setProfile(null);
        }).finally(() => {
          setLoading(false);
          setIsLoading(false);
        });
      } else {
        // Session absente ou invalide, on force la déconnexion
        signOut();
        setLoading(false);
        setIsLoading(false);
      }
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
      console.log("fetchProfile userId:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      console.log("fetchProfile response:", { data, error });

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        if (error.code === "401" || (error.message && error.message.toLowerCase().includes("jwt"))) {
          toast.error("Votre session a expiré. Veuillez vous reconnecter.");
          await signOut();
          return;
        }
        toast.error("Erreur lors de la récupération du profil: " + error.message);
        return;
      }

      // Vérification stricte de la cohérence des données
      if (!data || data.id !== userId) {
        console.error("Incohérence détectée : le profil récupéré ne correspond pas à l'utilisateur connecté");
        toast.error("Erreur de cohérence des données. Veuillez vous reconnecter.");
        await signOut();
        return;
      }

      if (!data) {
        console.error("Aucun profil trouvé pour l'utilisateur:", userId);
        toast.error("Aucun profil trouvé. Veuillez compléter votre profil.");
        navigate("/onboarding/profile");
        return;
      }

      // Mapping vers l'interface Profile locale
      const firstName = data?.first_name ?? '';
      const lastName = data?.last_name ?? '';
      
      const mappedProfile: Profile = {
        id: data?.id ?? '',
        first_name: firstName,
        last_name: lastName,
        is_association: data?.is_association ?? false,
        avatar_url: data?.avatar_url ?? undefined,
        bio: data?.bio ?? '',
        location: data?.location ?? '',
        phone: data?.phone ?? '',
        // Propriétés synthétiques
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
        role: data?.is_association ? 'association' : 'benevole',
        avatar: data?.avatar_url ?? undefined,
        email: data?.email ?? user?.email ?? '',
        created_at: data?.created_at ?? '',
        updated_at: data?.updated_at ?? '',
      };
      
      setProfile(mappedProfile);
    } catch (error: any) {
      console.error("Erreur lors de la récupération du profil:", error);
      toast.error("Erreur lors de la récupération du profil: " + error.message);
      await signOut(); // Force la déconnexion en cas d'erreur
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        toast.error("Client Supabase non initialisé !");
        throw new Error("Client Supabase non initialisé");
      }
      console.log("[signIn] Tentative de connexion avec:", email);
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("[signIn] Réponse Supabase:", response);
      const { error, data } = response;
      if (error) {
        toast.error(error.message || "Erreur de connexion Supabase");
        throw error;
      }
      if (!data?.user) {
        toast.error("Aucun utilisateur retourné par Supabase");
        throw new Error("Aucun utilisateur retourné par Supabase");
      }
      toast.success("Connexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de connexion:", error.message, error);
      toast.error(error.message || "Erreur de connexion inconnue");
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
    } catch (error: any) {
      console.error("Erreur de déconnexion Supabase:", error.message);
    } finally {
      // Nettoyage complet de l'état
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      setIsLoading(false);
      
      // Nettoyage du localStorage
      localStorage.removeItem('supabase.auth.token');
      // Suppression de toutes les clés liées à l'authentification
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      toast.success("Déconnexion réussie");
      navigate("/auth/login");
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
