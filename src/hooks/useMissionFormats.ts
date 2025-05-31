
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MissionFormat {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export const useMissionFormats = () => {
  return useQuery({
    queryKey: ["mission-formats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mission_formats")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};
