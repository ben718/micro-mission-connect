
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DifficultyLevel {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export const useDifficultyLevels = () => {
  return useQuery({
    queryKey: ["difficulty-levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("difficulty_levels")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};
