
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  id: string;
  section_key: string;
  title?: string;
  content?: string;
  subtitle?: string;
  metadata?: any;
  display_order: number;
  is_active: boolean;
}

export const useSiteContent = (sectionKey?: string) => {
  return useQuery({
    queryKey: ["site-content", sectionKey],
    queryFn: async () => {
      let query = supabase
        .from("site_content")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (sectionKey) {
        query = query.eq("section_key", sectionKey);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (sectionKey && data) {
        return data[0] || null;
      }

      return data || [];
    },
  });
};
