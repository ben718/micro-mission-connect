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

export type MissionWithDetails = MissionWithOrganization & {
  participants_count: number;
  is_registered?: boolean;
  mission_skills?: MissionSkill[];
  required_skills?: string[];
  participant_status?: string; // Pour la compatibilité avec DashboardBenevole
  participant_id?: string; // Pour la compatibilité avec DashboardBenevole
  registrations?: MissionRegistrationWithProfiles[]; // Liste des inscriptions
};

// Type for mission registrations with profiles information
export type MissionRegistrationWithProfiles = MissionRegistration & {
  profile?: CompleteProfile;
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
  format?: string | string[]; // 'Présentiel', 'À distance', 'Hybride'
  page?: number;
  pageSize?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius?: number; // Rayon de recherche en kilomètres
  };
  status?: MissionStatus | MissionStatus[]; // Statut(s) de la mission
  difficulty_level?: string | string[]; // Niveau(x) de difficulté
  engagement_level?: string | string[]; // Niveau(x) d'engagement
  requiredSkills?: string[]; // Compétences requises
  organization_sector?: string | string[]; // Secteur(s) d'organisation
};

// Statuts possibles d'une mission
export type MissionStatus = 'active' | 'terminée' | 'annulée';

// Interface pour les statistiques de missions dans le tableau de bord
export interface MissionStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  totalVolunteers: number;
  totalHours: number;
}

// Statuts possibles pour une participation
export type ParticipationStatus = 'inscrit' | 'confirmé' | 'annulé' | 'terminé';

// Interface pour les notifications liées aux missions
export interface MissionNotification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}
