
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MissionWithDetails, MissionFilters } from "@/types";

export const useMissions = (filters?: MissionFilters & { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async () => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          mission_type:mission_types(id, name, description),
          organization_profile:organization_profiles!inner(
            id,
            organization_name,
            logo_url,
            organization_sectors(id, name)
          ),
          mission_skills(
            id,
            required_level,
            is_required,
            skills(id, name, category)
          ),
          mission_registrations(id, status)
        `)
        .eq("status", "active")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      // Appliquer les filtres
      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters?.mission_type_id) {
        query = query.eq("mission_type_id", filters.mission_type_id);
      }

      if (filters?.format) {
        query = query.eq("format", filters.format);
      }

      if (filters?.difficulty_level) {
        query = query.eq("difficulty_level", filters.difficulty_level);
      }

      if (filters?.engagement_level) {
        query = query.eq("engagement_level", filters.engagement_level);
      }

      if (filters?.city) {
        query = query.eq("location", filters.city);
      }

      // Pagination
      if (filters?.page !== undefined && filters?.pageSize) {
        const from = filters.page * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching missions:", error);
        throw error;
      }

      // Calculer les places restantes et enrichir les données
      const enrichedData: MissionWithDetails[] = (data || []).map(mission => ({
        ...mission,
        available_spots_remaining: Math.max(0, 
          (mission.available_spots || 0) - (mission.mission_registrations?.length || 0)
        ),
      }));

      return {
        data: enrichedData,
        count: count || 0,
      };
    },
  });
};

export const useMission = (id: string) => {
  return useQuery({
    queryKey: ["mission", id],
    queryFn: async (): Promise<MissionWithDetails | null> => {
      const { data, error } = await supabase
        .from("missions")
        .select(`
          *,
          mission_type:mission_types(id, name, description),
          organization_profile:organization_profiles!inner(
            id,
            organization_name,
            description,
            logo_url,
            website_url,
            organization_sectors(id, name)
          ),
          mission_skills(
            id,
            required_level,
            is_required,
            skills(id, name, category, description)
          ),
          mission_registrations(
            id,
            status,
            registration_date,
            profiles(id, first_name, last_name)
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching mission:", error);
        throw error;
      }

      if (!data) return null;

      return {
        ...data,
        available_spots_remaining: Math.max(0, 
          (data.available_spots || 0) - (data.mission_registrations?.length || 0)
        ),
      };
    },
  });
};
