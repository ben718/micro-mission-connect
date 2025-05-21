
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionFilters, MissionWithAssociation, MissionWithDetails } from "@/types/mission";

export function useMissions(filters?: MissionFilters) {
  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async (): Promise<MissionWithAssociation[]> => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          association:association_id(id, first_name, last_name, avatar_url, bio)
        `)
        .eq("status", "open");
      
      // Appliquer les filtres si ils existent
      if (filters) {
        // Recherche par texte dans le titre ou la description
        if (filters.query) {
          query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }
        
        // Filtre par ville
        if (filters.city) {
          query = query.ilike("city", `%${filters.city}%`);
        }
        
        // Filtre par mission à distance
        if (filters.remote) {
          query = query.is("lat", null).is("lng", null);
        }
        
        // Filtre par plage de dates
        if (filters.dateRange) {
          if (filters.dateRange.start) {
            query = query.gte("starts_at", filters.dateRange.start.toISOString());
          }
          if (filters.dateRange.end) {
            query = query.lte("ends_at", filters.dateRange.end.toISOString());
          }
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useMission(id: string | undefined) {
  return useQuery({
    queryKey: ["mission", id],
    queryFn: async (): Promise<MissionWithDetails | null> => {
      if (!id) return null;
      
      // Récupérer la mission avec ses détails
      const { data, error } = await supabase
        .from("missions")
        .select(`
          *,
          association:association_id(id, first_name, last_name, avatar_url, bio),
          mission_categories(category_id)
        `)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      // Récupérer les catégories associées
      const categoryIds = data.mission_categories.map((mc: any) => mc.category_id);
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .in("id", categoryIds);
      
      // Récupérer le nombre de participants
      const { count } = await supabase
        .from("mission_participants")
        .select("*", { count: "exact", head: true })
        .eq("mission_id", id)
        .eq("status", "registered");
      
      // Vérifier si l'utilisateur actuel est inscrit
      const user = supabase.auth.getSession();
      let isRegistered = false;
      
      if ((await user).data.session?.user) {
        const { data: participation } = await supabase
          .from("mission_participants")
          .select("*")
          .eq("mission_id", id)
          .eq("user_id", (await user).data.session!.user.id)
          .eq("status", "registered")
          .maybeSingle();
        
        isRegistered = !!participation;
      }
      
      return {
        ...data,
        categories: categories || [],
        participants_count: count || 0,
        is_registered: isRegistered
      };
    },
    enabled: !!id
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("city")
        .eq("status", "open")
        .not("city", "is", null);
      
      if (error) throw error;
      
      // Extraire et dédupliquer les villes
      const cities = [...new Set(data.map(item => item.city))];
      return cities.filter(Boolean).sort();
    },
  });
}
