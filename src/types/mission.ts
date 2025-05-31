
import { Database } from "@/integrations/supabase/types";
import type { CompleteProfile, OrganizationProfile } from './profile';

// Types dérivés de la base de données Supabase
export type Mission = Database["public"]["Tables"]["missions"]["Row"] & {
  organization: Organization;
  mission_type?: MissionType;
  required_skills: string[];
  participants_count: number;
  geo_location?: {
    type: "Point";
    coordinates: [number, number];
  };
  // Legacy compatibility fields
  category?: string;
  date?: string;
  timeSlot?: string;
  duration?: string;
  participants?: string;
};

export type MissionType = Database["public"]["Tables"]["mission_types"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type MissionSkill = Database["public"]["Tables"]["mission_skills"]["Row"];
export type MissionRegistration = Database["public"]["Tables"]["mission_registrations"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"] & {
  badge?: Badge;
  acquired_at?: string;
};
export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"] & {
  skill?: Skill;
};

// Add Category type
export type Category = {
  id: string;
  name: string;
};

// Type pour l'organisation
export type Organization = OrganizationProfile;

// Types pour l'interface utilisateur
export type MissionWithOrganization = Mission & {
  organization: Organization;
  mission_type?: MissionType;
  // Legacy compatibility fields
  category?: string;
  date?: string;
  timeSlot?: string;
  duration?: string;
  participants?: string;
};

export type MissionWithAssociation = MissionWithOrganization;

export type MissionFormat = "Présentiel" | "À distance" | "Hybride";
export type MissionDifficulty = "débutant" | "intermédiaire" | "expert";
export type MissionEngagement = "Ultra-rapide" | "Petit coup de main" | "Mission avec suivi" | "Projet long";
export type MissionStatus = 'active' | 'terminée' | 'annulée';
export type ParticipationStatus = 'inscrit' | 'confirmé' | 'annulé' | 'terminé' | 'no_show';

export type MissionWithDetails = MissionWithOrganization & {
  required_skills: string[];
  participants_count: number;
  is_registered?: boolean;
  registration_status?: ParticipationStatus;
  mission_registrations?: any[];
};

// Type for date range selection used in calendar component
export type DateRangeSelection = {
  from: Date | undefined;
  to: Date | undefined;
};

// Types pour les filtres de recherche - Fixed status type
export type MissionFilters = {
  query?: string;
  location?: string;
  categoryIds?: string[];
  missionTypeIds?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  format?: MissionFormat | MissionFormat[];
  page?: number;
  pageSize?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
  status?: string; // Fixed: simplified to just string
  difficulty_level?: MissionDifficulty | MissionDifficulty[];
  engagement_level?: MissionEngagement | MissionEngagement[];
  requiredSkills?: string[];
  organization_sector?: string | string[];
  remote?: boolean;
  postal_code?: string;
};

// Interface pour les statistiques de missions
export interface MissionStats {
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  totalParticipants: number;
  totalHours: number;
}

// Interface pour les notifications liées aux missions
export interface MissionNotification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  link_url?: string;
}

export const MISSION_FORMATS: MissionFormat[] = ["Présentiel", "À distance", "Hybride"];
export const MISSION_DIFFICULTIES: MissionDifficulty[] = ["débutant", "intermédiaire", "expert"];
export const MISSION_ENGAGEMENTS: MissionEngagement[] = ["Ultra-rapide", "Petit coup de main", "Mission avec suivi", "Projet long"];
export const MISSION_STATUSES: MissionStatus[] = ['active', 'terminée', 'annulée'];
