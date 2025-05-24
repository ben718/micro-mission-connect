
import { Database } from "@/integrations/supabase/types";
import type { Profile } from './profile';

// Types dérivés de la base de données Supabase
export type Mission = Database["public"]["Tables"]["missions"]["Row"] & {
  category?: string; // Pour la compatibilité avec le code existant
  date?: string; // Pour la compatibilité avec le code existant
  timeSlot?: string; // Pour la compatibilité avec le code existant
  duration?: string; // Pour la compatibilité avec le code existant
  participants?: string; // Pour la compatibilité avec le code existant
  requiredSkills?: string[]; // Pour la compatibilité avec le code existant
  associationId?: string; // Pour la compatibilité avec le code existant
  participant_status?: string; // Pour la compatibilité avec DashboardBenevole
  participant_id?: string; // Pour la compatibilité avec DashboardBenevole
  // Nouvelles propriétés pour correspondre aux colonnes de la base
  starts_at?: string; // Alias pour start_date
  spots_taken?: number; // Calculé à partir des inscriptions
  spots_available?: number; // Alias pour available_spots
  skills_required?: string[]; // Calculé à partir des mission_skills
  city?: string; // Calculé à partir de l'adresse
};

export type Category = Database["public"]["Tables"]["organization_sectors"]["Row"];
export type MissionRegistration = Database["public"]["Tables"]["mission_registrations"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];

// Type pour l'association (profile d'une association)
export type Association = Profile;

// Types pour l'interface utilisateur
export type MissionWithAssociation = Mission & {
  association: Association;
  categories?: Category[];
};

export type MissionWithDetails = MissionWithAssociation & {
  participants_count: number;
  is_registered?: boolean;
  mission_categories?: {
    id?: string;
    mission_id?: string;
    category_id: string;
  }[];
  participant_status?: string; // Pour la compatibilité avec DashboardBenevole
  participant_id?: string; // Pour la compatibilité avec DashboardBenevole
  participants_list?: any[]; // Pour la compatibilité avec MissionManagement
  mission_participants?: MissionParticipantWithProfiles[]; // Pour la compatibilité avec MissionManagement
};

// Type for mission participants with profiles information
export type MissionParticipantWithProfiles = MissionRegistration & {
  profiles?: Profile;
};

// Type for date range selection used in calendar component
// Match the react-day-picker DateRange structure
export type DateRangeSelection = {
  from: Date | undefined;
  to: Date | undefined;
};

// Types pour les filtres de recherche
export type MissionFilters = {
  query?: string;
  city?: string;
  categoryIds?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  remote?: boolean;
  page?: number;
  pageSize?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius?: number; // Rayon de recherche en kilomètres
  };
  status?: MissionStatus | MissionStatus[]; // Ajout du status pour le filtre
  // Nouveaux types de filtres
  missionTypes?: string[]; // Types de mission (aide alimentaire, soutien scolaire...)
  associationTypes?: string[]; // Types d'association (enfance, santé...)
  durations?: string[]; // Durées (15min, 30min, 1h...)
  requiredSkills?: string[]; // Compétences requises
  impacts?: string[]; // Impact recherché
  engagementLevels?: string[]; // Niveaux d'engagement
};

export interface MissionApplication {
  id: string;
  missionId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissionApplicationWithDetails extends MissionApplication {
  mission: Mission;
  user: Profile;
}

// Nouveaux types pour la gestion des missions

// Statuts possibles d'une mission
export type MissionStatus = 'draft' | 'open' | 'in_progress' | 'filled' | 'completed' | 'cancelled';

// Interface pour les statistiques de missions dans le tableau de bord
export interface MissionStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  totalVolunteers: number;
  totalHours: number;
}

// Interface pour les validations de participation
export interface ParticipationValidation {
  participant_id: string;
  mission_id: string;
  user: Profile;
  attendance: boolean;
  feedback?: string;
  rating?: number;
  badges?: string[];
  skills?: string[];
}

// Statuts possibles pour une participation
export type ParticipationStatus = 'registered' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

// Interface pour les notifications liées aux missions
export interface MissionNotification {
  id: string;
  user_id: string;
  mission_id: string;
  type: 'inscription' | 'rappel' | 'annulation' | 'validation' | 'feedback';
  message: string;
  read: boolean;
  created_at: string;
}
