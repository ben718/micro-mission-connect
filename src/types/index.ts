
import { Database } from "@/integrations/supabase/types";

// Types de base depuis Supabase
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Mission = Database['public']['Tables']['missions']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type MissionRegistration = Database['public']['Tables']['mission_registrations']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type MissionType = Database['public']['Tables']['mission_types']['Row'];
export type OrganizationProfile = Database['public']['Tables']['organization_profiles']['Row'];
export type OrganizationSector = Database['public']['Tables']['organization_sectors']['Row'];

// Types étendus avec des relations
export type MissionWithDetails = Mission & {
  organization_profiles?: OrganizationProfile & {
    organization_sectors?: OrganizationSector;
  };
  mission_types?: MissionType;
  mission_registrations?: MissionRegistration[];
};

export type ProfileWithBadges = Profile & {
  user_badges?: Array<{
    badges: Badge;
    acquisition_date: string;
  }>;
  user_skills?: Array<{
    skills: Skill;
    level: string;
  }>;
};

// Types pour les vues optimisées
export type AvailableMissionDetail = Database['public']['Views']['available_missions_details']['Row'];

// Types pour les formulaires
export interface MissionFormData {
  title: string;
  description: string;
  location: string;
  start_date: Date;
  duration_minutes: number;
  available_spots: number;
  format: 'remote' | 'hybrid' | 'onsite';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  engagement_level: 'low' | 'medium' | 'high';
  mission_type_id?: string;
  address?: string;
  postal_code?: string;
  desired_impact?: string;
  image_url?: string;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  bio?: string;
  website?: string;
  city?: string;
  postal_code?: string;
  address?: string;
  profile_picture_url?: string;
}

// Types pour les filtres
export interface MissionFilters {
  query?: string;
  location?: string;
  format?: Mission['format'];
  difficulty_level?: Mission['difficulty_level'];
  engagement_level?: Mission['engagement_level'];
  missionTypeIds?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Types pour les réponses API
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Types d'erreur standardisés
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}
