
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MissionWithDetails, MissionFilters } from "@/types/mission";

export const useMissions = (filters?: MissionFilters & { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async () => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          mission_type:mission_types(id, name, description),
          organization_profiles!inner(
            id,
            organization_name,
            logo_url,
            organization_sectors(id, name)
          ),
          mission_registrations(id, status)
        `)
        .eq("status", "active")
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      // Apply filters
      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters?.mission_type_id) {
        query = query.eq("mission_type_id", filters.mission_type_id);
      }

      if (filters?.format) {
        query = query.eq("format", filters.format);
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

      // Enrich data
      const enrichedData: MissionWithDetails[] = (data || []).map(mission => ({
        ...mission,
        available_spots_remaining: Math.max(0, 
          (mission.available_spots || 0) - (mission.mission_registrations?.length || 0)
        ),
        participants_count: mission.mission_registrations?.length || 0,
      }));

      return {
        data: enrichedData,
        count: count || 0,
      };
    },
  });
};

export const useUserMissions = (userId?: string) => {
  return useQuery({
    queryKey: ["user-missions", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("mission_registrations")
        .select(`
          *,
          missions(
            id,
            title,
            description,
            start_date,
            duration_minutes,
            location,
            organization_profiles(organization_name, logo_url)
          )
        `)
        .eq("user_id", userId)
        .order("registration_date", { ascending: false });

      if (error) {
        console.error("Error fetching user missions:", error);
        throw error;
      }

      return data?.map(registration => ({
        ...registration.missions,
        participant_status: registration.status,
        registration_date: registration.registration_date,
        organization: registration.missions?.organization_profiles
      })) || [];
    },
    enabled: !!userId,
  });
};

export const useMissionStats = (userId?: string, isAssociation?: boolean) => {
  return useQuery({
    queryKey: ["mission-stats", userId, isAssociation],
    queryFn: async () => {
      if (!userId) return { totalHours: 0, totalMissions: 0 };

      if (isAssociation) {
        // Stats pour les associations
        const { data: orgProfile } = await supabase
          .from("organization_profiles")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (!orgProfile) return { totalHours: 0, totalMissions: 0 };

        const { data, error } = await supabase
          .from("missions")
          .select("duration_minutes")
          .eq("organization_id", orgProfile.id);

        if (error) throw error;

        const totalHours = data?.reduce((sum, mission) => sum + (mission.duration_minutes || 0), 0) || 0;
        return { totalHours: totalHours / 60, totalMissions: data?.length || 0 };
      } else {
        // Stats pour les bénévoles
        const { data, error } = await supabase
          .from("mission_registrations")
          .select(`
            missions(duration_minutes)
          `)
          .eq("user_id", userId)
          .eq("status", "terminé");

        if (error) throw error;

        const totalHours = data?.reduce((sum, reg) => sum + (reg.missions?.duration_minutes || 0), 0) || 0;
        return { totalHours: totalHours / 60, totalMissions: data?.length || 0 };
      }
    },
    enabled: !!userId,
  });
};

export const useAssociationMissions = (organizationId?: string) => {
  return useQuery({
    queryKey: ["association-missions", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("missions")
        .select(`
          *,
          mission_registrations(
            id,
            status,
            user_id,
            profiles(id, first_name, last_name, profile_picture_url)
          )
        `)
        .eq("organization_id", organizationId)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Error fetching association missions:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!organizationId,
  });
};

export const useMissionActions = () => {
  return {
    acceptRegistration: async (registrationId: string) => {
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status: "confirmé" })
        .eq("id", registrationId);
      
      if (error) throw error;
    },
    rejectRegistration: async (registrationId: string) => {
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status: "annulé" })
        .eq("id", registrationId);
      
      if (error) throw error;
    },
  };
};

export const useOrganizationSectors = () => {
  return useQuery({
    queryKey: ["organization-sectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_sectors")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching organization sectors:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useMissionTypes = () => {
  return useQuery({
    queryKey: ["mission-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mission_types")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching mission types:", error);
        throw error;
      }

      return data || [];
    },
  });
};
