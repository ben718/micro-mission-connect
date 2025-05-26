import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationSectors } from "./useOrganizationSectors";
import { useCities } from "./useCities";

export const useOrganizationFilters = () => {
  // Récupérer les secteurs d'organisation
  const { data: sectors } = useOrganizationSectors();

  // Récupérer les régions disponibles
  const { data: regions } = useQuery({
    queryKey: ["organization-regions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("region")
        .not("region", "is", null);

      if (error) throw error;
      return [...new Set(data.map(c => c.region))].sort();
    },
  });

  // Récupérer les départements disponibles
  const { data: departments } = useQuery({
    queryKey: ["organization-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("department")
        .not("department", "is", null);

      if (error) throw error;
      return [...new Set(data.map(c => c.department))].sort();
    },
  });

  // Récupérer les villes disponibles
  const { data: cities } = useCities();

  return {
    sectors,
    regions,
    departments,
    cities,
    isLoading: false, // À implémenter si nécessaire
  };
}; 