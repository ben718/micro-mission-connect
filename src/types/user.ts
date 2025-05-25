import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User extends SupabaseUser {
  // Propriétés étendues pour la compatibilité avec l'authentification Supabase
  // Ces propriétés sont utilisées pour déterminer le rôle de l'utilisateur
  is_organization?: boolean;
  role?: string;
}
