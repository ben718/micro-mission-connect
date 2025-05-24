import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { CompleteProfile, Profile, OrganizationProfile } from "@/types/profile";

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CompleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[AuthProvider] Initialisation...");

    // Configurer l'écouteur d'état d'authentification avant tout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("[AuthProvider] État d'authentification changé:", event);
        
        // Mettre à jour l'état de la session et de l'utilisateur immédiatement
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Puis récupérer le profil si nécessaire
        if (currentSession?.user) {
          console.log("[AuthProvider] Utilisateur connecté, récupération du profil...");
          setTimeout(() => { // Utilisation de setTimeout pour éviter les deadlocks
            fetchProfile(currentSession.user.id).catch(error => {
              console.error("[AuthProvider] Erreur lors de la récupération du profil:", error);
            });
          }, 0);
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
        }).finally(() => {
          setLoading(false);
          setIsLoading(false);
        });
      } else {
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
      console.log("[fetchProfile] Récupération du profil pour userId:", userId);
      
      // Timeout de sécurité sur la récupération du profil
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("La récupération du profil a expiré.")), 10000)
      );
      
      // Récupérer le profil de base
      const profilePromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const result = await Promise.race([profilePromise, timeoutPromise]) as any;
      const { data: profileData, error: profileError } = result;

      console.log("[fetchProfile] Résultat profil:", { profileData, profileError });

      if (profileError) {
        if (profileError.code === "401" || (profileError.message && profileError.message.toLowerCase().includes("jwt"))) {
          console.error("[fetchProfile] Session expirée:", profileError);
          toast.error("Votre session a expiré. Veuillez vous reconnecter.");
          await signOut();
          return;
        }
        
        if (profileError.code === "PGRST116") {
          console.error("[fetchProfile] Profil non trouvé pour l'utilisateur:", userId);
          toast.error("Aucun profil trouvé. Veuillez compléter votre profil.");
          await signOut();
          return;
        }

        console.error("[fetchProfile] Erreur spécifique lors de la récupération du profil:", profileError);
        toast.error("Erreur lors de la récupération du profil: " + profileError.message);
        return;
      }

      if (!profileData) {
        console.error("[fetchProfile] Aucun profil trouvé pour l'utilisateur:", userId);
        toast.error("Aucun profil trouvé. Veuillez vous reconnecter.");
        await signOut();
        return;
      }

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
          .select("*, sector_id(*)")
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
        .select("skill_id")
        .eq("user_id", userId);
        
      const skills = skillsData ? skillsData.map(item => item.skill_id) : [];
      
      // Récupérer les badges de l'utilisateur
      const { data: badgesData } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId);
        
      const badges = badgesData ? badgesData.map(item => item.badge_id) : [];

      // Mapping vers l'interface CompleteProfile
      const firstName = profileData?.first_name ?? '';
      const lastName = profileData?.last_name ?? '';
      const city = profileData?.city ?? '';
      const postalCode = profileData?.postal_code ?? '';
      
      const mappedProfile: CompleteProfile = {
        id: profileData?.id ?? '',
        first_name: firstName,
        last_name: lastName,
        profile_picture_url: profileData?.profile_picture_url ?? undefined,
        bio: profileData?.bio ?? '',
        phone: profileData?.phone ?? '',
        address: profileData?.address ?? '',
        city: city,
        postal_code: postalCode,
        latitude: profileData?.latitude ?? null,
        longitude: profileData?.longitude ?? null,
        created_at: profileData?.created_at ?? '',
        updated_at: profileData?.updated_at ?? '',
        last_login: profileData?.last_login ?? null,
        is_organization: isOrganization,
        skills: skills,
        badges: badges,
        
        // Propriétés synthétiques
        name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
        avatar: profileData?.profile_picture_url ?? undefined,
        location: city && postalCode ? `${city} (${postalCode})` : city || postalCode || '',
        email: user?.email ?? '',
        role: isOrganization ? 'organization' : 'volunteer',
      };
      
      // Ajouter les données d'organisation si disponibles
      if (organizationData) {
        mappedProfile.organization = {
          id: organizationData.id,
          user_id: organizationData.user_id,
          organization_name: organizationData.organization_name,
          description: organizationData.description,
          logo_url: organizationData.logo_url,
          website_url: organizationData.website_url,
          address: organizationData.address,
          latitude: organizationData.latitude,
          longitude: organizationData.longitude,
          sector_id: organizationData.sector_id,
          siret_number: organizationData.siret_number,
          creation_date: organizationData.creation_date,
          created_at: organizationData.created_at,
          updated_at: organizationData.updated_at,
          sector: organizationData.sector_id
        };
        
        // Propriétés synthétiques pour la compatibilité
        mappedProfile.association_description = organizationData.description;
        mappedProfile.website = organizationData.website_url;
      }
      
      setProfile(mappedProfile);
      setLoading(false);
      setIsLoading(false);
    } catch (error: any) {
      console.error("[fetchProfile] Erreur générale lors de la récupération du profil:", error);
      toast.error(error.message || "Erreur lors de la récupération du profil");
      
      // En cas d'erreur critique, déconnecter l'utilisateur
      await signOut(); 
      setLoading(false);
      setIsLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (!supabase) {
        toast.error("Client Supabase non initialisé !");
        throw new Error("Client Supabase non initialisé");
      }
      
      console.log("[signIn] Tentative de connexion avec:", email);
      
      // Timeout de sécurité sur la connexion
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("La connexion a expiré. Veuillez réessayer.")), 10000)
      );
      
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const response = await Promise.race([authPromise, timeoutPromise]) as any;
      
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
      
      // La session et l'utilisateur seront mis à jour via onAuthStateChange
      toast.success("Connexion réussie");
      
      // Navigation vers la page d'accueil
      navigate("/");
    } catch (error: any) {
      console.error("[signIn] Erreur de connexion:", error.message, error);
      toast.error(error.message || "Erreur de connexion inconnue");
      
      // Nettoyage de l'état en cas d'échec
      setUser(null);
      setProfile(null);
      
      throw error;
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
      navigate("/auth/confirmation");
    } catch (error: any) {
      console.error("[signUp] Erreur d'inscription:", error.message);
      toast.error(error.message || "Erreur lors de l'inscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      await supabase.auth.signOut();
      
      // Nettoyage complet de l'état
      setUser(null);
      setProfile(null);
      setSession(null);
      
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
    } catch (error: any) {
      console.error("[signOut] Erreur de déconnexion Supabase:", error.message);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
