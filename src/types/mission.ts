
import { Database } from "@/integrations/supabase/types";
import type { Profile } from './profile';

// Types dérivés de la base de données Supabase
export type Mission = Database["public"]["Tables"]["missions"]["Row"] & {
  category?: string; // Pour la compatibilité avec le code existant
  date?: string; // Pour la compatibilité avec le code existant
  timeSlot?: string; // Pour la compatibilité avec le code existant
  duration?: string; // Pour la compatibilité avec le code existant
  location?: string; // Pour la compatibilité avec le code existant
  participants?: string; // Pour la compatibilité avec le code existant
  requiredSkills?: string[]; // Pour la compatibilité avec le code existant
  associationId?: string; // Pour la compatibilité avec le code existant
};

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MissionCategory = Database["public"]["Tables"]["mission_categories"]["Row"];
export type MissionParticipant = Database["public"]["Tables"]["mission_participants"]["Row"];
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
};

// Type for date range selection used in calendar component
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
