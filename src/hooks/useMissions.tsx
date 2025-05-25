
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Mission, MissionFilters, MissionWithOrganization, MissionWithDetails, Organization, MissionStatus, MissionStats, MissionType, Skill } from "@/types/mission";
import { toast } from "sonner";

export function useMissions(filters?: MissionFilters) {
  const pageSize = filters?.pageSize || 12; // Default page size
  const page = filters?.page || 0; // Default to first page (0-indexed)
  const start = page * pageSize;
  const end = start + pageSize - 1;

  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async (): Promise<{ data: MissionWithOrganization[] | null, count: number | null }> => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          organization:organization_id(*)
        `, { count: 'exact' });
      
      // Par défaut, on ne filtre que les missions actives
      if (!filters?.status) {
        query = query.eq("status", "active");
      } else if (Array.isArray(filters.status)) {
        query = query.in("status", filters.status);
      } else if (typeof filters?.status === 'string') {
        query = query.eq("status", filters.status);
      }
      
      // Appliquer les filtres si ils existent
      if (filters) {
        // Recherche par texte dans le titre ou la description
        if (filters.query) {
          query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }
        
        // Filtre par localisation
        if (filters.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }
        
        // Filtre par format (présentiel, à distance, hybride)
        if (filters.format) {
          if (Array.isArray(filters.format)) {
            query = query.in("format", filters.format);
          } else {
            query = query.eq("format", filters.format);
          }
        }
        
        // Filtre par plage de dates
        if (filters.dateRange) {
          if (filters.dateRange.start) {
            query = query.gte("start_date", filters.dateRange.start.toISOString());
          }
          if (filters.dateRange.end) {
            query = query.lte("end_date", filters.dateRange.end.toISOString());
          }
        }
        
        // Filtre par types de mission
        if (filters.missionTypeIds && filters.missionTypeIds.length > 0) {
          query = query.in("mission_type_id", filters.missionTypeIds);
        }
        
        // Filtre par niveau de difficulté
        if (filters.difficulty_level) {
          if (Array.isArray(filters.difficulty_level)) {
            query = query.in("difficulty_level", filters.difficulty_level);
          } else {
            query = query.eq("difficulty_level", filters.difficulty_level);
          }
        }
        
        // Filtre par niveau d'engagement
        if (filters.engagement_level) {
          if (Array.isArray(filters.engagement_level)) {
            query = query.in("engagement_level", filters.engagement_level);
          } else {
            query = query.eq("engagement_level", filters.engagement_level);
          }
        }
        
        // Filtre par coordonnées (proximité)
        if (filters.coordinates) {
          const { latitude, longitude, radius = 10 } = filters.coordinates;
          // Calcul simple de distance approximative (à adapter selon besoins de précision)
          // Ici on considère que 1 degré = ~111km
          const latDelta = radius / 111;
          const lngDelta = radius / (111 * Math.cos(latitude * Math.PI / 180));
          
          query = query
            .gte('latitude', latitude - latDelta)
            .lte('latitude', latitude + latDelta)
            .gte('longitude', longitude - lngDelta)
            .lte('longitude', longitude + lngDelta);
        }
      }
      
      // Appliquer la pagination
      query = query.range(start, end);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Transformer les données pour correspondre à l'interface MissionWithOrganization
      if (data) {
        const transformedData = data.map(mission => {
          const transformed = mission as unknown as MissionWithOrganization;
          
          // Ajout des propriétés compatibles avec l'ancien code
          transformed.category = ""; // Sera rempli plus tard avec les compétences
          transformed.date = new Date(mission.start_date).toLocaleDateString('fr-FR');
          transformed.timeSlot = new Date(mission.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          transformed.duration = `${Math.round(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 ? mission.duration_minutes % 60 : ''}`;
          transformed.participants = mission.available_spots.toString();
          transformed.associationId = mission.organization_id;
          
          return transformed;
        });
        
        // Récupérer les compétences requises pour chaque mission
        for (const mission of transformedData) {
          const { data: skillsData } = await supabase
            .from("mission_skills")
            .select("skill_id(id, name)")
            .eq("mission_id", mission.id);
            
          if (skillsData && skillsData.length > 0) {
            mission.requiredSkills = skillsData.map((item: any) => item.skill_id.name);
            mission.category = skillsData[0].skill_id.name; // Utiliser la première compétence comme catégorie
          } else {
            mission.requiredSkills = [];
          }
        }
        
        return { data: transformedData, count };
      }
      
      return { data, count };
    },
  });
}

// Export existing hooks
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
          organization:organization_id(*),
          mission_type:mission_type_id(*)
        `)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      // Récupérer les compétences requises
      const { data: skillsData } = await supabase
        .from("mission_skills")
        .select("*, skill:skill_id(*)")
        .eq("mission_id", id);
      
      // Récupérer le nombre de participants
      const { count } = await supabase
        .from("mission_registrations")
        .select("*", { count: "exact", head: true })
        .eq("mission_id", id)
        .eq("status", "inscrit");
      
      // Vérifier si l'utilisateur actuel est inscrit
      const user = supabase.auth.getSession();
      let isRegistered = false;
      let participantId = null;
      let participantStatus = null;
      
      if ((await user).data.session?.user) {
        const { data: registration } = await supabase
          .from("mission_registrations")
          .select("*")
          .eq("mission_id", id)
          .eq("user_id", (await user).data.session!.user.id)
          .maybeSingle();
        
        isRegistered = !!registration;
        if (registration) {
          participantId = registration.id;
          participantStatus = registration.status;
        }
      }
      
      // Transformer les données pour correspondre à l'interface MissionWithDetails
      if (data) {
        const transformedData = {
          ...data,
          mission_skills: skillsData || [],
          required_skills: skillsData ? skillsData.map((s: any) => s.skill.name) : [],
          participants_count: count || 0,
          is_registered: isRegistered,
          participant_id: participantId,
          participant_status: participantStatus,
          
          // Ajout des propriétés compatibles avec l'ancien code
          category: skillsData && skillsData.length > 0 ? skillsData[0].skill.name : 'Général',
          date: new Date(data.start_date).toLocaleDateString('fr-FR'),
          timeSlot: new Date(data.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          duration: `${Math.round(data.duration_minutes / 60)}h${data.duration_minutes % 60 ? data.duration_minutes % 60 : ''}`,
          participants: data.available_spots.toString(),
          associationId: data.organization_id,
        } as unknown as MissionWithDetails;
        
        return transformedData;
      }
      
      return null;
    },
    enabled: !!id
  });
}

export function useMissionTypes() {
  return useQuery({
    queryKey: ["mission-types"],
    queryFn: async (): Promise<MissionType[]> => {
      const { data, error } = await supabase
        .from("mission_types")
        .select("*");
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from("skills")
        .select("*");
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("missions")
        .select("location")
        .eq("status", "active")
        .not("location", "is", null);
      
      if (error) throw error;
      
      // Extraire et dédupliquer les localisations
      const locations = [...new Set(data.map(item => item.location))];
      return locations.filter(Boolean).sort();
    },
  });
}

// Hook pour récupérer les missions d'une organisation
export function useOrganizationMissions(organizationId: string | undefined, status?: MissionStatus | MissionStatus[]) {
  return useQuery({
    queryKey: ["organization-missions", organizationId, status],
    queryFn: async (): Promise<MissionWithDetails[] | null> => {
      if (!organizationId) return null;
      
      let query = supabase
        .from("missions")
        .select(`
          *,
          mission_type:mission_type_id(*)
        `)
        .eq("organization_id", organizationId);
      
      // Filtrer par statut si spécifié
      if (status) {
        if (Array.isArray(status)) {
          query = query.in("status", status);
        } else {
          query = query.eq("status", status);
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transformer les données pour correspondre à l'interface MissionWithDetails
      if (data) {
        const transformedData = await Promise.all(data.map(async (mission) => {
          // Récupérer les inscriptions pour cette mission
          const { data: registrations, error: regError } = await supabase
            .from("mission_registrations")
            .select(`
              *,
              profile:user_id(*)
            `)
            .eq("mission_id", mission.id);
            
          if (regError) console.error("Erreur lors de la récupération des inscriptions:", regError);
          
          // Récupérer les compétences requises
          const { data: skillsData } = await supabase
            .from("mission_skills")
            .select("*, skill:skill_id(*)")
            .eq("mission_id", mission.id);
          
          const transformed = {
            ...mission,
            registrations: registrations || [],
            participants_count: registrations ? registrations.length : 0,
            mission_skills: skillsData || [],
            required_skills: skillsData ? skillsData.map((s: any) => s.skill.name) : [],
            
            // Propriétés synthétiques pour la compatibilité
            category: skillsData && skillsData.length > 0 ? skillsData[0].skill.name : 'Général',
            date: new Date(mission.start_date).toLocaleDateString('fr-FR'),
            timeSlot: new Date(mission.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: `${Math.round(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 ? mission.duration_minutes % 60 : ''}`,
            participants: mission.available_spots.toString(),
            associationId: mission.organization_id,
          } as unknown as MissionWithDetails;
          
          return transformed;
        }));
        
        return transformedData;
      }
      
      return null;
    },
    enabled: !!organizationId
  });
}

// Alias for compatibility
export const useAssociationMissions = useOrganizationMissions;

// Hook pour récupérer les missions auxquelles participe un utilisateur
export function useUserMissions(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-missions", userId],
    queryFn: async (): Promise<MissionWithDetails[] | null> => {
      if (!userId) return null;
      
      const { data: registrations, error } = await supabase
        .from("mission_registrations")
        .select(`
          id,
          status,
          mission_id,
          mission:mission_id(
            *,
            organization:organization_id(*),
            mission_type:mission_type_id(*)
          )
        `)
        .eq("user_id", userId);
      
      if (error) throw error;
      
      if (registrations) {
        // Extraire et transformer les missions
        const missions = await Promise.all(registrations.map(async (registration) => {
          const mission = registration.mission as Mission;
          
          // Récupérer les compétences requises
          const { data: skillsData } = await supabase
            .from("mission_skills")
            .select("*, skill:skill_id(*)")
            .eq("mission_id", mission.id);
          
          const transformed = {
            ...mission,
            participant_status: registration.status,
            participant_id: registration.id,
            is_registered: true,
            mission_skills: skillsData || [],
            required_skills: skillsData ? skillsData.map((s: any) => s.skill.name) : [],
            
            // Propriétés synthétiques pour la compatibilité
            category: skillsData && skillsData.length > 0 ? skillsData[0].skill.name : 'Général',
            date: new Date(mission.start_date).toLocaleDateString('fr-FR'),
            timeSlot: new Date(mission.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: `${Math.round(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 ? mission.duration_minutes % 60 : ''}`,
            participants: mission.available_spots.toString(),
            associationId: mission.organization_id,
          } as unknown as MissionWithDetails;
          
          return transformed;
        }));
        
        return missions;
      }
      
      return null;
    },
    enabled: !!userId
  });
}

// Hook pour récupérer les statistiques des missions pour le tableau de bord
export function useMissionStats(userId: string | undefined, isOrganization: boolean = false) {
  return useQuery({
    queryKey: ["mission-stats", userId, isOrganization],
    queryFn: async (): Promise<MissionStats | null> => {
      if (!userId) return null;
      
      if (isOrganization) {
        // Récupérer l'ID de l'organisation
        const { data: orgData } = await supabase
          .from("organization_profiles")
          .select("id")
          .eq("user_id", userId)
          .single();
          
        if (!orgData) return null;
        
        const organizationId = orgData.id;
        
        // Statistiques pour les organisations
        const { data: missions } = await supabase
          .from("missions")
          .select("*")
          .eq("organization_id", organizationId);
          
        if (!missions) return null;
        
        // Calculer les statistiques
        const totalMissions = missions.length;
        const activeMissions = missions.filter(m => m.status === 'active').length;
        const completedMissions = missions.filter(m => m.status === 'terminée').length;
        
        // Calculer le nombre total de bénévoles et d'heures
        let totalParticipants = 0;
        let totalHours = 0;
        
        for (const mission of missions) {
          // Compter les inscriptions confirmées ou terminées
          const { count } = await supabase
            .from("mission_registrations")
            .select("*", { count: "exact", head: true })
            .eq("mission_id", mission.id)
            .in("status", ["confirmé", "terminé"]);
            
          totalParticipants += count || 0;
          
          // Calculer les heures (durée en minutes / 60 * nombre de participants)
          totalHours += (mission.duration_minutes / 60) * (count || 0);
        }
        
        return {
          totalMissions,
          activeMissions,
          completedMissions,
          totalParticipants,
          totalHours: Math.round(totalHours)
        };
      } else {
        // Statistiques pour les bénévoles
        const { data: registrations } = await supabase
          .from("mission_registrations")
          .select("*, mission:mission_id(*)")
          .eq("user_id", userId);
          
        if (!registrations) return null;
        
        // Calculer les statistiques
        const totalMissions = registrations.length;
        const activeMissions = registrations.filter(r => r.status === 'inscrit' || r.status === 'confirmé').length;
        const completedMissions = registrations.filter(r => r.status === 'terminé').length;
        
        // Calculer le nombre total d'heures
        let totalHours = 0;
        
        for (const registration of registrations) {
          if (registration.status === 'terminé') {
            totalHours += (registration.mission.duration_minutes / 60);
          }
        }
        
        return {
          totalMissions,
          activeMissions,
          completedMissions,
          totalParticipants: 0, // Non applicable pour les bénévoles
          totalHours: Math.round(totalHours)
        };
      }
    },
    enabled: !!userId
  });
}

// Hook pour les actions sur les missions
export function useMissionActions() {
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
      queryClient.invalidateQueries({ queryKey: ["organization-missions"] });
      toast.success("Statut de la mission mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const changeMissionStatus = async (missionId: string, newStatus: MissionStatus) => {
    try {
      await updateMissionStatus.mutateAsync({ missionId, status: newStatus });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  const duplicateMission = async (missionId: string) => {
    try {
      // Récupérer la mission originale
      const { data: originalMission, error: fetchError } = await supabase
        .from("missions")
        .select("*")
        .eq("id", missionId)
        .single();

      if (fetchError) throw fetchError;

      // Créer une copie sans l'ID
      const { id, created_at, updated_at, ...missionCopy } = originalMission;
      missionCopy.title = `${missionCopy.title} (Copie)`;
      missionCopy.status = 'draft';

      const { error: insertError } = await supabase
        .from("missions")
        .insert(missionCopy);

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["organization-missions"] });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  return {
    updateMissionStatus,
    changeMissionStatus,
    duplicateMission,
  };
}
