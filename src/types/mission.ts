
import { Database } from "@/integrations/supabase/types";
import type { CompleteProfile, OrganizationProfile } from './profile';

// Types dérivés de la base de données Supabase
export type Mission = Database["public"]["Tables"]["missions"]["Row"] & {
  // Propriétés synthétiques pour la compatibilité avec le code existant
  category?: string; 
  date?: string; // Pour la compatibilité avec le code existant (dérivé de start_date)
  timeSlot?: string; // Pour la compatibilité avec le code existant
  duration?: string; // Pour la compatibilité avec le code existant (dérivé de duration_minutes)
  participants?: string; // Pour la compatibilité avec le code existant
  requiredSkills?: string[]; // Pour la compatibilité avec le code existant
  associationId?: string; // Alias pour organization_id
  required_skills: string[]; // Required property
  organization: Organization; // Required property
  id: string; // Required property
};

export type MissionType = Database["public"]["Tables"]["mission_types"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type MissionSkill = Database["public"]["Tables"]["mission_skills"]["Row"];
export type MissionRegistration = Database["public"]["Tables"]["mission_registrations"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"];

// Type pour l'organisation
export type Organization = OrganizationProfile;

// Types pour l'interface utilisateur
export type MissionWithOrganization = Mission & {
  organization: Organization;
  mission_type?: MissionType;
};

export type MissionWithAssociation = MissionWithOrganization;

export type MissionFormat = "présentiel" | "à distance" | "hybride";
export type MissionDifficulty = "débutant" | "intermédiaire" | "expert";
export type MissionEngagement = "ultra-rapide" | "petit coup de main" | "mission avec suivi" | "projet long";
export type MissionStatus = 'active' | 'terminée' | 'annulée' | 'open' | 'completed' | 'cancelled';
export type ParticipationStatus = 'inscrit' | 'confirmé' | 'annulé' | 'terminé' | 'registered' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type MissionWithDetails = MissionWithOrganization & {
  required_skills: string[];
  participants_count: number;
  is_registered?: boolean;
  registration_status?: ParticipationStatus;
};

// Type for date range selection used in calendar component
export type DateRangeSelection = {
  from: Date | undefined;
  to: Date | undefined;
};

// Types pour les filtres de recherche
export type MissionFilters = {
  query?: string;
  location?: string;
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
    radius?: number; // Rayon de recherche en kilomètres
  };
  status?: MissionStatus | MissionStatus[];
  difficulty_level?: MissionDifficulty | MissionDifficulty[];
  engagement_level?: MissionEngagement | MissionEngagement[];
  requiredSkills?: string[];
  organization_sector?: string | string[];
};

// Interface pour les statistiques de missions dans le tableau de bord
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

export const MISSION_FORMATS: MissionFormat[] = ["présentiel", "à distance", "hybride"];
export const MISSION_DIFFICULTIES: MissionDifficulty[] = ["débutant", "intermédiaire", "expert"];
export const MISSION_ENGAGEMENTS: MissionEngagement[] = ["ultra-rapide", "petit coup de main", "mission avec suivi", "projet long"];
