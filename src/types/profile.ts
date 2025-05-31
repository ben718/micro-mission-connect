import { Database } from "@/integrations/supabase/types";

// Type de base depuis Supabase
export type BaseProfile = Database['public']['Tables']['profiles']['Row'];

// Type Profile étendu avec les relations
export type Profile = BaseProfile & {
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
    };
    acquisition_date: string;
  }>;
  is_organization: boolean;
};

export type OrganizationSector = Database['public']['Tables']['organization_sectors']['Row'];

export type OrganizationProfile = Database['public']['Tables']['organization_profiles']['Row'] & {
  organization_sectors?: OrganizationSector;
  sector?: OrganizationSector;
};

export type CompleteProfile = Profile & {
  organization_profile?: OrganizationProfile;
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
