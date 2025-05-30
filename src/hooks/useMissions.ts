
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionStats } from "@/types/mission";
import { toast } from "sonner";

// Hook pour récupérer les catégories de missions
export const useCategories = () => {
  return useQuery({
    queryKey: ["mission-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mission_types")
        .select("*")
        .order("name");

      if (error) throw error;
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

      if (error) throw error;
      return data || [];
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("location")
        .eq("status", "active")
        .not("location", "is", null);

      if (error) throw error;

      // Extraire et dédupliquer les localisations
      const locations = [...new Set(data?.map(item => item.location).filter(Boolean) || [])];
      return locations.sort();
    },
  });
};

// Updated interface to match the type definition
interface UseMissionsFilters {
  query?: string;
  location?: string;
  status?: string | string[];
  organization_id?: string;
  categoryIds?: string[];
  missionTypeIds?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  format?: string | string[];
  difficulty_level?: string | string[];
  engagement_level?: string | string[];
  page?: number;
  pageSize?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
  requiredSkills?: string[];
  organization_sector?: string | string[];
  remote?: boolean;
  postal_code?: string;
}

export const useMissions = (filters?: UseMissionsFilters) => {
  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async () => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          organization_profiles!organization_id (
            id,
            user_id,
            organization_name,
            description,
            website_url,
            logo_url,
            address,
            latitude,
            longitude,
            location,
            sector_id,
            siret_number,
            creation_date,
            created_at,
            updated_at,
            organization_sectors!sector_id (
              id,
              name,
              description,
              created_at,
              updated_at
            )
          ),
          mission_types (
            id,
            name,
            description,
            created_at,
            updated_at
          ),
          mission_skills (
            skill:skill_id (
              id,
              name,
              description
            )
          ),
          mission_registrations (
            id,
            status
          )
        `)
        .eq("status", "active");

      if (filters?.query) {
        query = query.ilike("title", `%${filters.query}%`);
      }

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.organization_id) {
        query = query.eq("organization_id", filters.organization_id);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const transformedData = (data || []).map(mission => ({
        ...mission,
        organization: {
          ...mission.organization_profiles,
          organization_sectors: mission.organization_profiles?.organization_sectors
        },
        mission_type: mission.mission_types,
        required_skills: mission.mission_skills?.map(ms => ms.skill?.name).filter(Boolean) || [],
        participants_count: mission.mission_registrations?.filter(mr => mr.status === 'accepté').length || 0,
        // Handle geo_location safely
        geo_location: mission.geo_location && typeof mission.geo_location === 'object' && 'type' in mission.geo_location && 'coordinates' in mission.geo_location
          ? mission.geo_location as { type: "Point"; coordinates: [number, number] }
          : null
      }));

      return {
        data: transformedData,
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
          missions (
            *,
            organization_profiles!organization_id (
              id,
              organization_name,
              description,
              website_url,
              logo_url
            ),
            mission_types (
              id,
              name,
              description
            ),
            mission_skills (
              skill:skill_id (
                id,
                name,
                description
              )
            )
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return (data || []).map(registration => ({
        ...registration,
        mission: {
          ...registration.missions,
          organization: registration.missions.organization_profiles,
          mission_type: registration.missions.mission_types,
          required_skills: registration.missions.mission_skills?.map(ms => ms.skill?.name).filter(Boolean) || [],
        }
      }));
    },
    enabled: !!userId,
  });
};

export const useOrganizationMissions = (organizationId?: string, filterStatus?: string | string[]) => {
  return useQuery({
    queryKey: ["organization-missions", organizationId, filterStatus],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from("missions")
        .select(`
          *,
          mission_types (
            id,
            name,
            description
          ),
          mission_skills (
            skill:skill_id (
              id,
              name,
              description
            )
          ),
          mission_registrations (
            id,
            status
          )
        `)
        .eq("organization_id", organizationId);
        
      if (filterStatus) {
        if (Array.isArray(filterStatus)) {
          query = query.in("status", filterStatus);
        } else {
          query = query.eq("status", filterStatus);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return (data || []).map(mission => ({
        ...mission,
        mission_type: mission.mission_types,
        required_skills: mission.mission_skills?.map(ms => ms.skill?.name).filter(Boolean) || [],
        participants_count: mission.mission_registrations?.filter(mr => mr.status === 'accepté').length || 0,
      }));
    },
    enabled: !!organizationId,
  });
};

// Keep the old function name for backward compatibility
export const useAssociationMissions = useOrganizationMissions;

export const useMissionStats = (userId?: string) => {
  return useQuery({
    queryKey: ["mission-stats", userId],
    queryFn: async (): Promise<MissionStats> => {
      // Mock data for now
      return {
        totalMissions: 0,
        activeMissions: 0,
        completedMissions: 0,
        totalParticipants: 0,
        totalHours: 0,
      };
    },
    enabled: !!userId,
  });
};

export const useMissionActions = () => {
  const queryClient = useQueryClient();

  const updateMissionStatus = useMutation({
    mutationFn: async ({ missionId, status }: { missionId: string; status: string }) => {
      const { error } = await supabase
        .from("missions")
        .update({ status })
        .eq("id", missionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Statut de la mission mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const validateParticipation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: string }) => {
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("id", registrationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast.success("Participation validée");
    },
    onError: () => {
      toast.error("Erreur lors de la validation");
    },
  });

  return {
    updateMissionStatus,
    validateParticipation,
  };
};
