
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MissionWithDetails, ParticipationStatus } from "@/types/mission";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useMemo } from "react";

export function useOptimizedMissionDetails(missionId: string) {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();

  const queryKey = useMemo(() => ["mission", missionId, user?.id], [missionId, user?.id]);

  const { data: mission, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async (): Promise<MissionWithDetails | null> => {
      try {
        // Requête optimisée avec un seul appel pour toutes les données
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

        // Compter les participants en une seule requête
        const { count: participantsCount } = await supabase
          .from("mission_registrations")
          .select("*", { count: "exact" })
          .eq("mission_id", missionId)
          .eq("status", "inscrit");

        // Vérifier l'inscription de l'utilisateur si connecté
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Retry jusqu'à 3 fois, sauf pour les erreurs 404
      if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST116') {
        return false; // Pas de retry pour "not found"
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  return {
    mission,
    isLoading,
    error,
    refetch
  };
}
