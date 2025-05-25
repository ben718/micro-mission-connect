
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionFilters, MissionStats } from "@/types/mission";
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

export const useMissions = (filters?: MissionFilters) => {
  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async () => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          organization_profiles!organization_id (
            id,
            organization_name,
            description,
            website_url,
            logo_url,
            organization_sectors (
              id,
              name
            )
          )
        `);

      if (filters?.query) {
        query = query.ilike("title", `%${filters.query}%`);
      }

      if (filters?.location) {
        query = query.ilike("address", `%${filters.location}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
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
            )
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data || [];
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
          mission_registrations(count)
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
      
      // Add participants_count to each mission
      const missionsWithCount = await Promise.all((data || []).map(async (mission) => {
        const { count } = await supabase
          .from("mission_registrations")
          .select("*", { count: "exact", head: true })
          .eq("mission_id", mission.id);

        return {
          ...mission,
          participants_count: count || 0,
        };
      }));

      return missionsWithCount;
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
