import { Database } from "@/integrations/supabase/types";

// Types dérivés de la base de données Supabase
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Mission = Database["public"]["Tables"]["missions"]["Row"];
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
  mission_categories?: MissionCategory[];
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

// Type pour les sélections de date
export type DateRangeSelection = {
  from: Date | undefined;
  to: Date | undefined;
};
