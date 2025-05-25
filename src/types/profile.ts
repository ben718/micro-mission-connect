
import { Database } from "@/integrations/supabase/types";

// Type de base pour un profil utilisateur
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  is_association?: boolean;
  avatar_url?: string;
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
  organization?: OrganizationProfile;
  skills?: UserSkill[];
  badges?: UserBadge[];
  
  // Propriétés synthétiques pour la compatibilité avec le code existant
  name?: string; // Calculé à partir de first_name + last_name
  avatar?: string; // Alias pour profile_picture_url
  location?: string; // Calculé à partir de city et postal_code
  email?: string; // Pour la compatibilité avec useAuth
  role?: string; // 'organization' ou 'volunteer' calculé à partir de is_organization
}

// Types pour les compétences et badges
export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"] & {
  skill?: Skill;
};

export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"] & {
  badge?: Badge;
};

export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
