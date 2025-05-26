import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MissionType } from "@/types/mission";

export const useMissionTypes = () => {
  return useQuery({
    queryKey: ["mission-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mission_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as MissionType[];
    },
  });
}; 