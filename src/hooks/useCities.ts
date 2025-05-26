import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { City, CityFilters } from "@/types/cities";

export const useCities = (filters?: CityFilters) => {
  return useQuery({
    queryKey: ["cities", filters],
    queryFn: async () => {
      let query = supabase
        .from("cities")
        .select("*")
        .order("name");

      if (filters?.region) {
        query = query.eq("region", filters.region);
      }

      if (filters?.department) {
        query = query.eq("department", filters.department);
      }

      if (filters?.postal_code) {
        query = query.eq("postal_code", filters.postal_code);
      }

      if (filters?.query) {
        query = query.ilike("name", `%${filters.query}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as City[];
    },
  });
}; 