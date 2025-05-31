
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
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile with improved error handling and caching
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
          throw new Error(`Profile fetch error: ${profileError.message}`);
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

        // Construct complete profile with proper typing
        const completeProfile: Profile = {
          id: user.id,
          first_name: profileData?.first_name || null,
          last_name: profileData?.last_name || null,
          email: user.email || null,
          phone: profileData?.phone || null,
          bio: profileData?.bio || null,
          website: profileData?.website || null,
          city: profileData?.city || null,
          postal_code: profileData?.postal_code || null,
          address: profileData?.address || null,
          profile_picture_url: profileData?.profile_picture_url || null,
          latitude: profileData?.latitude || null,
          longitude: profileData?.longitude || null,
          last_login: profileData?.last_login || null,
          created_at: profileData?.created_at || new Date().toISOString(),
          updated_at: profileData?.updated_at || new Date().toISOString(),
          // Additional fields for compatibility
          avatar_url: profileData?.profile_picture_url || null,
          location: profileData?.city || null,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    console.log('[useAuth] Initializing auth state');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state changed:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[useAuth] Error getting session:', error);
      }
      console.log('[useAuth] Initial session:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

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
        return { data: null, error };
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
        return { data: null, error };
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
