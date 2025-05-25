
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
      return uniqueCities.map((name, index) => ({ id: index.toString(), name, postal_code: "" }));
    },
  });

  return { cities, loading: isLoading, error };
}

export function useSkills() {
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  return { skills, loading: isLoading, error };
}

// Main export function that combines all the hooks
export function useDynamicLists() {
  const categoriesResult = useCategories();
  const citiesResult = useCities();
  const skillsResult = useSkills();

  return {
    categories: categoriesResult.categories,
    cities: citiesResult.cities,
    skills: skillsResult.skills,
    isLoading: categoriesResult.loading || citiesResult.loading || skillsResult.loading,
    error: categoriesResult.error || citiesResult.error || skillsResult.error,
  };
}
