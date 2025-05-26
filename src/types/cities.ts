import { Database } from "@/integrations/supabase/types";

export type City = Database["public"]["Tables"]["cities"]["Row"];

export type CityWithCoordinates = City & {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

// Types pour les filtres de recherche de villes
export type CityFilters = {
  query?: string;
  region?: string;
  department?: string;
  postal_code?: string;
}; 