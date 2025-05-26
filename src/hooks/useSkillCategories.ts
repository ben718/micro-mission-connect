import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSkillCategories = () => {
  return useQuery({
    queryKey: ["skill-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("category")
        .order("category");

      if (error) throw error;

      // Récupérer les catégories uniques
      const categories = [...new Set(data.map(skill => skill.category))];
      return categories;
    },
  });
}; 