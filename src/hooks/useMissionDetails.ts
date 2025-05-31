
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MissionWithDetails, ParticipationStatus } from "@/types/mission";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandler";

export function useMissionDetails(missionId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: mission, isLoading } = useQuery({
    queryKey: ["mission", missionId],
    queryFn: async (): Promise<MissionWithDetails | null> => {
      try {
        const { data: mission, error } = await supabase
          .from("missions")
          .select(`
            *,
            organization:organization_id(
              *,
              sector:sector_id(*)
            ),
            mission_type:mission_type_id(*),
            mission_skills(
              *,
              skill:skill_id(*)
            ),
            mission_registrations(
              *,
              user:user_id(first_name, last_name)
            )
          `)
          .eq("id", missionId)
          .single();

        if (error) throw error;
        if (!mission) return null;

        const { count: participantsCount } = await supabase
          .from("mission_registrations")
          .select("*", { count: "exact" })
          .eq("mission_id", missionId)
          .eq("status", "inscrit");

        let isRegistered = false;
        let registrationStatus: ParticipationStatus | undefined;
        
        if (user) {
          const { data: registration } = await supabase
            .from("mission_registrations")
            .select("status")
            .eq("mission_id", missionId)
            .eq("user_id", user.id)
            .single();
          
          if (registration) {
            isRegistered = true;
            registrationStatus = registration.status as ParticipationStatus;
          }
        }

        return {
          ...mission,
          required_skills: mission.mission_skills?.map((ms: any) => ms.skill?.name).filter(Boolean) || [],
          participants_count: participantsCount || 0,
          is_registered: isRegistered,
          registration_status: registrationStatus,
          organization: mission.organization,
          mission_type: mission.mission_type,
          mission_registrations: mission.mission_registrations || [],
          geo_location: mission.geo_location && 
            typeof mission.geo_location === 'object' && 
            'type' in mission.geo_location && 
            'coordinates' in mission.geo_location
              ? mission.geo_location as { type: "Point"; coordinates: [number, number] }
              : null
        };
      } catch (error) {
        handleError(error, "Erreur lors du chargement de la mission");
        return null;
      }
    },
    enabled: !!missionId
  });

  const participateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté pour participer");
      if (!mission) throw new Error("Mission non trouvée");

      const { error } = await supabase
        .from("mission_registrations")
        .insert({
          user_id: user.id,
          mission_id: mission.id,
          status: "inscrit" as ParticipationStatus,
          registration_date: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      toast.success("Inscription réussie !");
    },
    onError: (error: any) => {
      handleError(error, "Erreur lors de l'inscription");
    }
  });

  const updateRegistrationStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: ParticipationStatus }) => {
      if (!user) throw new Error("Vous devez être connecté");
      if (!mission) throw new Error("Mission non trouvée");

      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("mission_id", mission.id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      toast.success("Statut mis à jour");
    },
    onError: (error: any) => {
      handleError(error, "Erreur lors de la mise à jour");
    }
  });

  const validateParticipationMutation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: string }) => {
      if (!user) throw new Error("Vous devez être connecté");
      
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("id", registrationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      toast.success("Validation mise à jour");
    },
    onError: (error: any) => {
      handleError(error, "Erreur lors de la validation");
    }
  });

  return {
    mission,
    isLoading,
    participate: participateMutation.mutate,
    updateRegistrationStatus: updateRegistrationStatusMutation.mutate,
    validateParticipation: validateParticipationMutation,
    isParticipating: participateMutation.isPending,
    isUpdatingStatus: updateRegistrationStatusMutation.isPending
  };
}
