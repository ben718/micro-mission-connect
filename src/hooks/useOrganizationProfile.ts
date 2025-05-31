
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrganizationProfile } from "@/types/profile";

export function useOrganizationProfile(userId?: string) {
  return useQuery({
    queryKey: ["organization-profile", userId],
    queryFn: async (): Promise<OrganizationProfile | null> => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("organization_profiles")
        .select(`
          *,
          organization_sectors!sector_id(*)
        `)
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching organization profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!userId,
  });
}
