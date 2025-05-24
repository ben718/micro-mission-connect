import { Database } from "@/integrations/supabase/types";

// Interface de base pour un profil utilisateur
export interface Profile {
  id?: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
  last_login?: string | null;
  
  // Propriétés synthétiques pour la compatibilité avec le code existant
  name?: string; // Calculé à partir de first_name + last_name
  avatar?: string; // Alias pour profile_picture_url
  location?: string; // Calculé à partir de city et postal_code
  email?: string; // Pour la compatibilité avec useAuth
}

// Interface pour un profil d'organisation
export interface OrganizationProfile {
  id?: string;
  user_id: string;
  organization_name: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sector_id?: string | null;
  siret_number?: string | null;
  creation_date?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  sector?: OrganizationSector;
}

// Interface pour un secteur d'organisation
export interface OrganizationSector {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface combinée pour un profil complet (utilisateur + organisation si applicable)
export interface CompleteProfile extends Profile {
  is_organization: boolean;
  organization?: OrganizationProfile;
  skills?: string[];
  badges?: string[];
  
  // Propriétés synthétiques pour la compatibilité avec le code existant
  role?: string; // 'organization' ou 'volunteer' calculé à partir de is_organization
  association_description?: string; // Alias pour organization?.description
  website?: string; // Alias pour organization?.website_url
}
