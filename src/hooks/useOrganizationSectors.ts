import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationSector } from "@/types/profile";

export const useOrganizationSectors = () => {
  return useQuery({
    queryKey: ["organization-sectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_sectors")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as OrganizationSector[];
    },
  });
}; 