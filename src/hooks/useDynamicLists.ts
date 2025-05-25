
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mission_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  return { categories, loading: isLoading, error };
}

export function useCities() {
  const { data: cities, isLoading, error } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("location")
        .not("location", "is", null);

      if (error) throw error;

      // Extract unique cities
      const uniqueCities = [...new Set(data?.map(item => item.location).filter(Boolean) || [])];
      return uniqueCities.map((name, index) => ({ id: index.toString(), name }));
    },
  });

  return { cities, loading: isLoading, error };
}
