
import { Database } from "@/integrations/supabase/types";

// Types dérivés de la base de données Supabase
export type Mission = Database["public"]["Tables"]["missions"]["Row"];
export type MissionRegistration = Database["public"]["Tables"]["mission_registrations"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Type pour l'association (organization_profiles)
export type Association = Database["public"]["Tables"]["organization_profiles"]["Row"] & {
  first_name?: string;
  last_name?: string;
};

// Types pour l'interface utilisateur
export type MissionWithAssociation = Mission & {
  association?: Association;
  organization_profiles?: Database["public"]["Tables"]["organization_profiles"]["Row"];
  mission_registrations?: MissionRegistration[];
  spots_taken?: number;
  available_spots_remaining?: number;
};

export type MissionWithDetails = MissionWithAssociation & {
  participants_count: number;
  is_registered?: boolean;
};

// Statuts possibles d'une mission
export type MissionStatus = 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';

// Statuts possibles pour une participation
export type ParticipationStatus = 'inscrit' | 'confirmé' | 'terminé' | 'annulé';

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
    radius?: number;
  };
  status?: MissionStatus | MissionStatus[];
  sector_id?: string;
  mission_type_id?: string;
  format?: string;
  difficulty_level?: string;
  engagement_level?: string;
  available_only?: boolean;
};
