
import { Database } from "@/integrations/supabase/types";

// Type de base pour un profil utilisateur
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  is_organization?: boolean;
  is_association?: boolean; // Add legacy compatibility
  user_skills?: any[];
  user_badges?: any[];
  email?: string;
};

// Type pour un profil d'organisation
export type OrganizationProfile = Database["public"]["Tables"]["organization_profiles"]["Row"] & {
  sector?: OrganizationSector;
};

// Type pour un secteur d'organisation
export type OrganizationSector = Database["public"]["Tables"]["organization_sectors"]["Row"];

// Type combiné pour un profil complet
export interface CompleteProfile extends Profile {
  is_organization: boolean;
  is_association?: boolean; // Add legacy compatibility
  organization_profile?: OrganizationProfile;
}

// Types pour les compétences et badges
export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"] & {
  skill?: Skill;
};

export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"] & {
  badge?: Badge;
};

export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
