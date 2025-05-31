
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  profile_picture_url: string | null;
  is_organization: boolean;
  organization_name: string | null;
  description: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
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
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error('AuthProvider - error fetching profile:', error);
        throw error;
      }

      console.log('AuthProvider - profile fetched:', data);
      return data as Profile;
    },
    enabled: !!user?.id,
  });

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

  const value = {
    user,
    profile: profile || null,
    isLoading: isLoading || (user && !profile && !profile),
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
