
import { Database } from "@/integrations/supabase/types";

// Types de base Supabase
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Mission = Database['public']['Tables']['missions']['Row'];
export type OrganizationProfile = Database['public']['Tables']['organization_profiles']['Row'];
export type OrganizationSector = Database['public']['Tables']['organization_sectors']['Row'];
export type MissionType = Database['public']['Tables']['mission_types']['Row'];
export type MissionRegistration = Database['public']['Tables']['mission_registrations']['Row'];
export type MissionSkill = Database['public']['Tables']['mission_skills']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];
export type UserSkill = Database['public']['Tables']['user_skills']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Types étendus pour l'interface
export type MissionWithDetails = Mission & {
  mission_type?: MissionType;
  organization_profile?: OrganizationProfile & {
    organization_sectors?: OrganizationSector;
  };
  mission_skills?: (MissionSkill & {
    skills?: Skill;
  })[];
  mission_registrations?: MissionRegistration[];
  available_spots_remaining?: number;
  is_registered?: boolean;
};

export type ProfileWithDetails = Profile & {
  organization_profiles?: OrganizationProfile & {
    organization_sectors?: OrganizationSector;
  };
  user_skills?: (UserSkill & {
    skills?: Skill;
  })[];
  user_badges?: (UserBadge & {
    badges?: Badge;
  })[];
};

// Types pour les filtres
export type MissionFilters = {
  query?: string;
  sector_id?: string;
  mission_type_id?: string;
  format?: string;
  difficulty_level?: string;
  engagement_level?: string;
  city?: string;
  skills?: string[];
  available_only?: boolean;
};

// Types pour les inscriptions
export type RegistrationData = {
  mission_id: string;
  user_id: string;
  status?: 'inscrit' | 'confirmé' | 'terminé' | 'annulé';
};

// Types pour l'authentification
export type UserRole = 'volunteer' | 'organization';

export type AuthData = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  organization_name?: string;
  organization_description?: string;
  sector_id?: string;
};
