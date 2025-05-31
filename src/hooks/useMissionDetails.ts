
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
        let cancellationCount = 0;
        
        if (user) {
          // Récupérer la dernière inscription de l'utilisateur pour cette mission
          const { data: userRegistration } = await supabase
            .from("mission_registrations")
            .select("*")
            .eq("mission_id", missionId)
            .eq("user_id", user.id)
            .order("registration_date", { ascending: false })
            .limit(1)
            .single();

          if (userRegistration) {
            isRegistered = userRegistration.status !== "annulé";
            registrationStatus = userRegistration.status as ParticipationStatus;
            cancellationCount = userRegistration.cancellation_count || 0;
          }
        }

        return {
          ...mission,
          required_skills: mission.mission_skills?.map((ms: any) => ms.skill?.name).filter(Boolean) || [],
          participants_count: participantsCount || 0,
          is_registered: isRegistered,
          registration_status: registrationStatus,
          cancellation_count: cancellationCount,
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
      if (!user) throw new Error("Vous devez être connecté pour vous inscrire à cette mission");
      if (!mission) throw new Error("Mission introuvable");

      // Vérifier si l'utilisateur a déjà annulé 2 fois
      if (mission.cancellation_count >= 2) {
        throw new Error("Vous avez atteint le nombre maximum d'annulations pour cette mission (2/2)");
      }

      console.log("Inscription en cours pour l'utilisateur:", user.id, "mission:", mission.id);

      // Vérifier d'abord si une inscription existe déjà
      const { data: existingRegistration, error: checkError } = await supabase
        .from("mission_registrations")
        .select("id, status, cancellation_count")
        .eq("user_id", user.id)
        .eq("mission_id", mission.id)
        .order("registration_date", { ascending: false })
        .limit(1)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification d'inscription:", checkError);
        throw checkError;
      }

      if (existingRegistration) {
        // Si une inscription existe
        if (existingRegistration.status === "annulé") {
          // Réactiver l'inscription annulée (le trigger gérera le compteur)
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
          throw new Error("Vous êtes déjà inscrit(e) à cette mission");
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
            registration_date: new Date().toISOString(),
            cancellation_count: 0
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
      toast.success("✅ Inscription confirmée ! Votre candidature a été soumise à l'organisation.");
    },
    onError: (error: any) => {
      console.error("Erreur complète d'inscription:", error);
      if (error.message?.includes('row-level security')) {
        toast.error("⚠️ Erreur de permissions. Veuillez vous reconnecter et réessayer.");
      } else if (error.message?.includes('unique constraint')) {
        toast.error("⚠️ Erreur technique lors de l'inscription. Veuillez réessayer dans quelques instants.");
      } else if (error.message?.includes('nombre maximum')) {
        toast.error("❌ " + error.message);
      } else {
        handleError(error, "Erreur lors de l'inscription");
      }
    }
  });

  const updateRegistrationStatusMutation = useMutation({
    mutationFn: async ({ status, cancelledByUser = true }: { status: ParticipationStatus; cancelledByUser?: boolean }) => {
      if (!user) throw new Error("Vous devez être connecté pour modifier votre inscription");
      if (!mission) throw new Error("Mission introuvable");

      console.log("Mise à jour du statut pour l'utilisateur:", user.id, "mission:", mission.id, "statut:", status);

      // Le trigger se chargera automatiquement d'incrémenter cancellation_count si nécessaire
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("mission_id", mission.id)
        .eq("user_id", user.id)
        .order("registration_date", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Erreur de mise à jour du statut:", error);
        throw error;
      }

      // Créer la notification après l'annulation réussie
      if (status === "annulé") {
        try {
          await notificationService.notifyMissionCancellation(user.id, mission.title, cancelledByUser);
        } catch (notifError) {
          console.error("Erreur lors de la création de notification d'annulation:", notifError);
          // Ne pas faire échouer l'annulation si la notification échoue
        }
      }
    },
    onSuccess: (_, { status, cancelledByUser }) => {
      // Invalider plusieurs clés de cache pour s'assurer que tout est mis à jour
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.refetchQueries({ queryKey });
      if (status === "annulé") {
        if (cancelledByUser) {
          toast.success("❌ Vous avez annulé votre inscription. Vous pouvez vous réinscrire si des places sont disponibles.");
        } else {
          toast.info("ℹ️ Votre inscription a été annulée par l'organisation.");
        }
      } else {
        toast.success("✅ Statut mis à jour avec succès.");
      }
    },
    onError: (error: any) => {
      console.error("Erreur complète de mise à jour:", error);
      if (error.message?.includes('row-level security')) {
        toast.error("⚠️ Erreur de permissions. Veuillez vous reconnecter et réessayer.");
      } else {
        handleError(error, "Erreur lors de la mise à jour de votre inscription");
      }
    }
  });

  const validateParticipationMutation = useMutation({
    mutationFn: async ({ 
      registrationId, 
      status, 
      userId, 
      reason 
    }: { 
      registrationId: string; 
      status: string; 
      userId: string;
      reason?: string;
    }) => {
      if (!user) throw new Error("Vous devez être connecté");
      
      // Obtenir les informations de la mission pour les notifications
      const { data: registration } = await supabase
        .from("mission_registrations")
        .select("*")
        .eq("id", registrationId)
        .single();
        
      if (!registration) throw new Error("Inscription non trouvée");
      
      // Mettre à jour le statut
      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("id", registrationId);

      if (error) throw error;
      
      // Envoyer la notification appropriée en fonction du statut
      if (status === "confirmé") {
        await notificationService.notifyMissionConfirmation(userId, mission?.title || "", mission?.id || "");
      } else if (status === "annulé") {
        await notificationService.notifyMissionCancellation(userId, mission?.title || "", false);
      } else if (status === "terminé") {
        await notificationService.notifyMissionCompleted(userId, mission?.title || "", mission?.id || "");
      } else if (status === "no_show") {
        await notificationService.notifyNoShow(userId, mission?.title || "");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("✅ Statut du participant mis à jour avec succès");
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
