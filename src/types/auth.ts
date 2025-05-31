
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Profile } from "./profile";

export interface AuthUser extends SupabaseUser {
  profile?: Profile;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
}
