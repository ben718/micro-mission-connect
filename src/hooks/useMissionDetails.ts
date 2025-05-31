import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MissionWithDetails, ParticipationStatus } from "@/types/mission";
import { toast } from "sonner";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useMemo } from "react";
import { notificationService } from "@/services/notificationService";

export function useMissionDetails(missionId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  // Optimisation de la clé de cache
  const queryKey = useMemo(() => ["mission", missionId, user?.id], [missionId, user?.id]);

  const { data: mission, isLoading, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<MissionWithDetails | null> => {
      try {
        const { data: mission, error } = await supabase
          .from("missions")
          .select(`
            *,
            organization:organization_id(
              *,
              organization_sectors:sector_id(*)
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
          const userRegistration = mission.mission_registrations?.find(
            (reg: any) => reg.user_id === user.id
          );
          
          if (userRegistration) {
            isRegistered = true;
            registrationStatus = userRegistration.status as ParticipationStatus;
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
        throw error;
      }
    },
    enabled: !!missionId,
    staleTime: 0, // Toujours refetch pour s'assurer d'avoir les données fraîches
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST116') {
        return false;
      }
      return failureCount < 3;
    }
  });

  const participateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté pour participer");
      if (!mission) throw new Error("Mission non trouvée");

      console.log("Inscription en cours pour l'utilisateur:", user.id, "mission:", mission.id);

      // Vérifier d'abord si une inscription existe déjà
      const { data: existingRegistrations, error: checkError } = await supabase
        .from("mission_registrations")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("mission_id", mission.id);

      if (checkError) {
        console.error("Erreur lors de la vérification d'inscription:", checkError);
        throw checkError;
      }

      const existingRegistration = existingRegistrations?.[0];

      if (existingRegistration) {
        // Si une inscription existe
        if (existingRegistration.status === "annulé") {
          // Réactiver l'inscription annulée
          const { error: updateError } = await supabase
            .from("mission_registrations")
            .update({ 
              status: "inscrit" as ParticipationStatus,
              registration_date: new Date().toISOString()
            })
            .eq("id", existingRegistration.id);

          if (updateError) {
            console.error("Erreur de réactivation d'inscription:", updateError);
            throw updateError;
          }
        } else if (existingRegistration.status === "inscrit" || existingRegistration.status === "confirmé") {
          throw new Error("Vous êtes déjà inscrit à cette mission");
        } else {
          // Pour les autres statuts, on permet la réinscription en mettant à jour
          const { error: updateError } = await supabase
            .from("mission_registrations")
            .update({ 
              status: "inscrit" as ParticipationStatus,
              registration_date: new Date().toISOString()
            })
            .eq("id", existingRegistration.id);

          if (updateError) {
            console.error("Erreur de mise à jour d'inscription:", updateError);
            throw updateError;
          }
        }
      } else {
        // Créer une nouvelle inscription
        const { error } = await supabase
          .from("mission_registrations")
          .insert({
            user_id: user.id,
            mission_id: mission.id,
            status: "inscrit" as ParticipationStatus,
            registration_date: new Date().toISOString()
          });

        if (error) {
          console.error("Erreur d'inscription:", error);
          throw error;
        }
      }

      // Créer la notification après l'inscription réussie
      try {
        await notificationService.notifyMissionRegistration(user.id, mission.title, mission.id);
      } catch (notifError) {
        console.error("Erreur lors de la création de notification:", notifError);
        // Ne pas faire échouer l'inscription si la notification échoue
      }
    },
    onSuccess: () => {
      // Invalider plusieurs clés de cache pour s'assurer que tout est mis à jour
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.refetchQueries({ queryKey });
      toast.success("Inscription réussie !");
    },
    onError: (error: any) => {
      console.error("Erreur complète d'inscription:", error);
      if (error.message?.includes('row-level security')) {
        toast.error("Erreur de permissions. Veuillez vous reconnecter.");
      } else if (error.message?.includes('unique constraint')) {
        toast.error("Erreur technique. Veuillez réessayer.");
      } else {
        handleError(error, "Erreur lors de l'inscription");
      }
    }
  });

  const updateRegistrationStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: ParticipationStatus }) => {
      if (!user) throw new Error("Vous devez être connecté");
      if (!mission) throw new Error("Mission non trouvée");

      console.log("Mise à jour du statut pour l'utilisateur:", user.id, "mission:", mission.id, "statut:", status);

      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("mission_id", mission.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Erreur de mise à jour du statut:", error);
        throw error;
      }

      // Créer la notification après l'annulation réussie
      if (status === "annulé") {
        try {
          await notificationService.notifyMissionCancellation(user.id, mission.title);
        } catch (notifError) {
          console.error("Erreur lors de la création de notification d'annulation:", notifError);
          // Ne pas faire échouer l'annulation si la notification échoue
        }
      }
    },
    onSuccess: (_, { status }) => {
      // Invalider plusieurs clés de cache pour s'assurer que tout est mis à jour
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.refetchQueries({ queryKey });
      if (status === "annulé") {
        toast.success("Inscription annulée");
      } else {
        toast.success("Statut mis à jour");
      }
    },
    onError: (error: any) => {
      console.error("Erreur complète de mise à jour:", error);
      if (error.message?.includes('row-level security')) {
        toast.error("Erreur de permissions. Veuillez vous reconnecter.");
      } else {
        handleError(error, "Erreur lors de la mise à jour");
      }
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
      queryClient.invalidateQueries({ queryKey });
      toast.success("Validation mise à jour");
    },
    onError: (error: any) => {
      handleError(error, "Erreur lors de la validation");
    }
  });

  return {
    mission,
    isLoading,
    error,
    participate: participateMutation.mutate,
    updateRegistrationStatus: updateRegistrationStatusMutation.mutate,
    validateParticipation: validateParticipationMutation,
    isParticipating: participateMutation.isPending,
    isUpdatingStatus: updateRegistrationStatusMutation.isPending
  };
}
