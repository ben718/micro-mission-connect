
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/types";

export function useMissions() {
  return useQuery({
    queryKey: ["missions"],
    queryFn: async (): Promise<Mission[]> => {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("status", "open");
      
      if (error) throw error;
      return data || [];
    },
  });
}
