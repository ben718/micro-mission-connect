
import { Database } from "@/integrations/supabase/types";

// Types de base depuis Supabase
export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  // Champs additionnels pour la compatibilité
  email?: string | null;
  avatar_url?: string | null;
  location?: string | null;
  user_skills?: any[];
  user_badges?: any[];
  is_organization?: boolean;
};

export type OrganizationProfile = Database['public']['Tables']['organization_profiles']['Row'] & {
  organization_sectors?: Database['public']['Tables']['organization_sectors']['Row'];
};

export type CompleteProfile = Profile & {
  organization_profile?: OrganizationProfile;
  user_skills?: Array<{
    id: string;
    skill: {
      id: string;
      name: string;
      category: string;
    };
    level: string;
  }>;
  user_badges?: Array<{
    id: string;
    badge: {
      id: string;
      name: string;
      description: string;
      icon_url?: string;
    };
    acquired_at: string;
  }>;
};

// Types pour les formulaires
export interface ProfileFormData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  website?: string;
  city?: string;
  postal_code?: string;
  address?: string;
  profile_picture_url?: string;
}

export interface OrganizationFormData {
  name: string;
  description?: string;
  website?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  organization_sector_id?: string;
}
