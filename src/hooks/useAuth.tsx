
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { AuthContextType } from "@/types/auth";
import type { Profile } from "@/types/profile";

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider - current user:', user);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('AuthProvider - no user id, returning null profile');
        return null;
      }

      console.log('AuthProvider - fetching profile for user:', user.id);
      
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_skills:user_skills(
            id,
            skill:skills(id, name, category),
            level
          ),
          user_badges:user_badges(
            id,
            badge:badges(id, name, description),
            acquisition_date
          )
        `)
        .eq("id", user.id)
        .single();

      if (error) {
        console.error('AuthProvider - error fetching profile:', error);
        throw error;
      }

      console.log('AuthProvider - profile fetched:', profileData);
      return profileData as Profile;
    },
    enabled: !!user?.id,
  });

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

  useEffect(() => {
    console.log('AuthProvider - useEffect running');
    
    const getSession = async () => {
      console.log('AuthProvider - getting session');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthProvider - session:', session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider - auth state change:', event, session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider - cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile: profile || null,
    isLoading: isLoading || (!!user && !profile),
    loading: isLoading || (!!user && !profile),
    signIn,
    signUp,
    signOut,
  };

  console.log('AuthProvider - providing value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
