
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MissionWithDetails, ParticipationStatus } from "@/types/mission";

export function useMissionDetails(missionId: string) {
  const queryClient = useQueryClient();

  const { data: mission, isLoading } = useQuery({
    queryKey: ["mission", missionId],
    queryFn: async () => {
      const { data, error } = await supabase
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
            user:user_id(*)
          )
        `)
        .eq("id", missionId)
        .single();

      if (error) throw error;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Transformer les données pour inclure les informations supplémentaires
      const transformedMission: MissionWithDetails = {
        ...data,
        required_skills: data.mission_skills?.map((ms: any) => ms.skill?.name).filter(Boolean) || [],
        participants_count: data.mission_registrations?.length || 0,
        is_registered: data.mission_registrations?.some(
          (reg: any) => reg.user_id === user?.id
        ) || false,
        registration_status: data.mission_registrations?.find(
          (reg: any) => reg.user_id === user?.id
        )?.status as ParticipationStatus,
        mission_registrations: data.mission_registrations || []
      };

      return transformedMission;
    }
  });

  const participateMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("mission_registrations")
        .insert({
          mission_id: missionId,
          user_id: user.id,
          status: "inscrit"
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
    }
  });

  const updateRegistrationStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: ParticipationStatus }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("mission_id", missionId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
    }
  });

  const validateParticipationMutation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: string }) => {
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("id", registrationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
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
