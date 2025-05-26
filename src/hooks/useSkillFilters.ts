import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSkillCategories } from "./useSkillCategories";

export const useSkillFilters = () => {
  // Récupérer les catégories de compétences
  const { data: categories } = useSkillCategories();

  // Récupérer les niveaux disponibles
  const { data: levels } = useQuery({
    queryKey: ["skill-levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_skills")
        .select("level")
        .not("level", "is", null);

      if (error) throw error;
      const uniqueLevels = [...new Set(data.map(s => Number(s.level)))];
      return uniqueLevels.sort((a, b) => a - b);
    },
  });

  return {
    categories,
    levels,
    isLoading: false, // À implémenter si nécessaire
  };
}; 