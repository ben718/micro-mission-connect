
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EngagementLevel {
  id: string;
  name: string;
  description?: string;
  duration_range?: string;
  display_order: number;
  is_active: boolean;
}

export const useEngagementLevels = () => {
  return useQuery({
    queryKey: ["engagement-levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagement_levels")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};
