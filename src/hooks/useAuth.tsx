
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ExtendedUser, ExtendedProfile } from '@/types';

interface AuthContextType {
  user: ExtendedUser | null;
  profile: ExtendedProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      // Charger le profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
        throw profileError;
      }

      // Vérifier s'il s'agit d'une organisation
      const { data: orgData } = await supabase
        .from('organization_profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .single();

      const isOrganization = !!orgData;

      // Construire l'objet utilisateur étendu
      const extendedUser: ExtendedUser = {
        ...authUser,
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || '',
        city: profileData?.city || '',
        is_organization: isOrganization,
        avatar_url: profileData?.profile_picture_url || '',
      } as ExtendedUser;

      const extendedProfile: ExtendedProfile = {
        ...profileData,
        is_association: isOrganization,
        avatar_url: profileData?.profile_picture_url || '',
      };

      setUser(extendedUser);
      setProfile(extendedProfile);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          city: userData.city,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      // Si c'est une organisation, créer le profil organisation
      if (userData.role === 'organization') {
        const { error: orgError } = await supabase
          .from('organization_profiles')
          .insert({
            user_id: data.user.id,
            organization_name: userData.organization_name,
            description: userData.organization_description,
            sector_id: userData.sector_id,
          });

        if (orgError) {
          console.error('Error creating organization profile:', orgError);
          throw orgError;
        }
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
