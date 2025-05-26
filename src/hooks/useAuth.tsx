
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
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

  // Fetch user profile with proper error handling
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      try {
        // First get basic profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          return null;
        }

        // Get user skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select(`
            *,
            skill:skill_id (*)
          `)
          .eq('user_id', user.id);

        if (skillsError) {
          console.error('Error fetching skills:', skillsError);
        }

        // Get user badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            *,
            badge:badge_id (*)
          `)
          .eq('user_id', user.id);

        if (badgesError) {
          console.error('Error fetching badges:', badgesError);
        }

        // Check if user is organization
        const { data: orgData, error: orgError } = await supabase
          .from('organization_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (orgError && orgError.code !== 'PGRST116') {
          console.error('Error fetching organization:', orgError);
        }

        // Construct complete profile
        const completeProfile: Profile = {
          ...profileData,
          user_skills: skillsData || [],
          user_badges: badgesData || [],
          is_organization: !!orgData,
          email: user.email || '',
        };

        return completeProfile;
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile: profileError ? null : profile,
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
