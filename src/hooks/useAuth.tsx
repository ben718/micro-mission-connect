
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Profile } from '@/types/profile';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile with improved error handling
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      try {
        console.log('[useAuth] Fetching profile for user:', user.id);
        
        // Get basic profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('[useAuth] Error fetching profile:', profileError);
          return null;
        }

        // Get user skills
        const { data: skillsData } = await supabase
          .from('user_skills')
          .select(`
            *,
            skill:skill_id (*)
          `)
          .eq('user_id', user.id);

        // Get user badges
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select(`
            *,
            badge:badge_id (*)
          `)
          .eq('user_id', user.id);

        // Check if user is organization
        const { data: orgData } = await supabase
          .from('organization_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Construct complete profile
        const completeProfile: Profile = {
          id: user.id,
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          email: user.email || '',
          phone: profileData?.phone || '',
          bio: profileData?.bio || '',
          avatar_url: profileData?.avatar_url || '',
          location: profileData?.location || '',
          website: profileData?.website || '',
          created_at: profileData?.created_at || new Date().toISOString(),
          updated_at: profileData?.updated_at || new Date().toISOString(),
          user_skills: skillsData || [],
          user_badges: badgesData || [],
          is_organization: !!orgData,
        };

        console.log('[useAuth] Profile loaded successfully:', completeProfile);
        return completeProfile;
      } catch (error) {
        console.error('[useAuth] Unexpected error fetching profile:', error);
        return null;
      }
    },
    enabled: !!user?.id,
    retry: 1,
  });

  useEffect(() => {
    console.log('[useAuth] Initializing auth state');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[useAuth] Error getting session:', error);
      }
      console.log('[useAuth] Initial session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('[useAuth] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[useAuth] Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('[useAuth] Sign in error:', error);
        toast.error(error.message || 'Erreur de connexion');
        throw error;
      }
      
      console.log('[useAuth] Sign in successful');
      toast.success('Connexion réussie');
      return { data, error: null };
    } catch (error: any) {
      console.error('[useAuth] Sign in exception:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log('[useAuth] Attempting sign up for:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData,
        },
      });
      
      if (error) {
        console.error('[useAuth] Sign up error:', error);
        toast.error(error.message || 'Erreur lors de l\'inscription');
        throw error;
      }
      
      console.log('[useAuth] Sign up successful');
      toast.success('Inscription réussie. Vérifiez votre email pour confirmer votre compte.');
      return { data, error: null };
    } catch (error: any) {
      console.error('[useAuth] Sign up exception:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('[useAuth] Signing out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[useAuth] Sign out error:', error);
        toast.error('Erreur lors de la déconnexion');
      } else {
        toast.success('Déconnexion réussie');
      }
    } catch (error) {
      console.error('[useAuth] Sign out exception:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isLoading: loading || profileLoading,
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
