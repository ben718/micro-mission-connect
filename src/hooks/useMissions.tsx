
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Mission, MissionFilters, MissionWithAssociation, MissionWithDetails, Association, MissionStatus, MissionStats } from "@/types/mission";

export function useMissions(filters?: MissionFilters) {
  const pageSize = filters?.pageSize || 12; // Default page size
  const page = filters?.page || 0; // Default to first page (0-indexed)
  const start = page * pageSize;
  const end = start + pageSize - 1;

  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async (): Promise<{ data: MissionWithAssociation[] | null, count: number | null }> => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          association:association_id(*)
        `, { count: 'exact' });
      
      // Par défaut, on ne filtre que les missions ouvertes
      if (!filters?.status) {
        query = query.in("status", ["open", "in_progress", "filled"]);
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
        
        // Filtre par ville
        if (filters.city) {
          query = query.ilike("city", `%${filters.city}%`);
        }
        
        // Filtre par mission à distance
        if (filters.remote) {
          query = query.is("lat", null).is("lng", null);
        }
        
        // Filtre par plage de dates
        if (filters.dateRange) {
          if (filters.dateRange.start) {
            query = query.gte("starts_at", filters.dateRange.start.toISOString());
          }
          if (filters.dateRange.end) {
            query = query.lte("ends_at", filters.dateRange.end.toISOString());
          }
        }
        
        // Filtre par catégories
        if (filters.categoryIds && filters.categoryIds.length > 0) {
          query = query.filter('mission_categories.category_id', 'in', filters.categoryIds);
        }
        
        // Nouveaux filtres
        if (filters.missionTypes && filters.missionTypes.length > 0) {
          // Supposons que mission_type est stocké dans un champ ou une relation
          query = query.filter('mission_type', 'in', filters.missionTypes);
        }
        
        if (filters.associationTypes && filters.associationTypes.length > 0) {
          // Filtre sur les types d'association (pourrait nécessiter une jointure)
          query = query.filter('association.types', 'cs', `{${filters.associationTypes.join(',')}}`);
        }
        
        if (filters.durations && filters.durations.length > 0) {
          // Convertir les durées textuelles en minutes pour le filtre
          const durationRanges = filters.durations.map(d => {
            switch (d) {
              case '15min': return [1, 15];
              case '30min': return [16, 30];
              case '1h': return [31, 60];
              case 'demi-journée': return [61, 240];
              default: return [0, 999]; // À définir librement
            }
          });
          
          // Construire une condition OR pour les différentes plages de durée
          let durationConditions = durationRanges.map(([min, max]) => 
            `duration_minutes.gte.${min},duration_minutes.lte.${max}`
          ).join(',');
          
          query = query.or(`${durationConditions}`);
        }
        
        // Filtre par compétences requises
        if (filters.requiredSkills && filters.requiredSkills.length > 0) {
          // Filtrer sur le champ skills_required qui est un tableau
          query = query.filter('skills_required', 'cs', `{${filters.requiredSkills.join(',')}}`);
        }
        
        // Filtre par impact recherché
        if (filters.impacts && filters.impacts.length > 0) {
          // Supposons qu'il y a un champ impact ou une relation
          query = query.filter('impact', 'in', filters.impacts);
        }
        
        // Filtre par niveau d'engagement
        if (filters.engagementLevels && filters.engagementLevels.length > 0) {
          // Mapper les niveaux d'engagement à des durées ou d'autres critères
          let engagementConditions: string[] = [];
          
          if (filters.engagementLevels.includes('ultra-rapide')) {
            engagementConditions.push('duration_minutes.lte.30');
          }
          if (filters.engagementLevels.includes('petit-coup-de-main')) {
            engagementConditions.push('duration_minutes.gt.30,duration_minutes.lte.120');
          }
          if (filters.engagementLevels.includes('mission-avec-suivi')) {
            engagementConditions.push('duration_minutes.gt.120,duration_minutes.lte.240');
          }
          if (filters.engagementLevels.includes('projet-long')) {
            engagementConditions.push('duration_minutes.gt.240');
          }
          
          if (engagementConditions.length > 0) {
            query = query.or(`${engagementConditions.join(',')}`);
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
            .gte('lat', latitude - latDelta)
            .lte('lat', latitude + latDelta)
            .gte('lng', longitude - lngDelta)
            .lte('lng', longitude + lngDelta);
        }
      }
      
      // Appliquer la pagination
      query = query.range(start, end);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Transformer les données pour correspondre à l'interface MissionWithAssociation
      if (data) {
        const transformedData = data.map(mission => {
          const transformed = mission as unknown as MissionWithAssociation;
          // Ajout des propriétés compatibles avec l'ancien code
          transformed.category = mission.skills_required?.[0] || 'Général';
          transformed.date = new Date(mission.starts_at).toLocaleDateString('fr-FR');
          transformed.location = mission.address || `${mission.city}, ${mission.postal_code}`;
          transformed.timeSlot = new Date(mission.starts_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          transformed.duration = `${Math.round(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 || ''}`;
          transformed.participants = mission.spots_taken.toString() + '/' + mission.spots_available.toString();
          transformed.requiredSkills = mission.skills_required || [];
          transformed.associationId = mission.association_id;
          
          // Si l'association existe, ajouter la propriété name
          if (transformed.association) {
            transformed.association.name = `${transformed.association.first_name || ''} ${transformed.association.last_name || ''}`.trim();
          }
          
          return transformed;
        });
        
        return { data: transformedData, count };
      }
      
      return { data, count };
    },
  });
}

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
          association:association_id(*),
          mission_categories(category_id)
        `)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      // Récupérer les catégories associées
      const categoryIds = data.mission_categories.map((mc: any) => mc.category_id);
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .in("id", categoryIds);
      
      // Récupérer le nombre de participants
      const { count } = await supabase
        .from("mission_participants")
        .select("*", { count: "exact", head: true })
        .eq("mission_id", id)
        .eq("status", "registered");
      
      // Vérifier si l'utilisateur actuel est inscrit
      const user = supabase.auth.getSession();
      let isRegistered = false;
      
      if ((await user).data.session?.user) {
        const { data: participation } = await supabase
          .from("mission_participants")
          .select("*")
          .eq("mission_id", id)
          .eq("user_id", (await user).data.session!.user.id)
          .eq("status", "registered")
          .maybeSingle();
        
        isRegistered = !!participation;
      }
      
      // Transformer les données pour correspondre à l'interface MissionWithDetails
      if (data) {
        const transformedData = {
          ...data,
          categories: categories || [],
          participants_count: count || 0,
          is_registered: isRegistered,
          // Ajout des propriétés compatibles avec l'ancien code
          category: data.skills_required?.[0] || 'Général',
          date: new Date(data.starts_at).toLocaleDateString('fr-FR'),
          location: data.address || `${data.city}, ${data.postal_code}`,
          timeSlot: new Date(data.starts_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          duration: `${Math.round(data.duration_minutes / 60)}h${data.duration_minutes % 60 || ''}`,
          participants: data.spots_taken.toString() + '/' + data.spots_available.toString(),
          requiredSkills: data.skills_required || [],
          associationId: data.association_id,
        } as unknown as MissionWithDetails;
        
        // Si l'association existe, ajouter la propriété name
        if (transformedData.association) {
          transformedData.association.name = `${transformedData.association.first_name || ''} ${transformedData.association.last_name || ''}`.trim();
        }
        
        return transformedData;
      }
      
      return null;
    },
    enabled: !!id
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("city")
        .eq("status", "open")
        .not("city", "is", null);
      
      if (error) throw error;
      
      // Extraire et dédupliquer les villes
      const cities = [...new Set(data.map(item => item.city))];
      return cities.filter(Boolean).sort();
    },
  });
}

// Nouvelles fonctions pour la gestion des missions

// Hook pour récupérer les missions d'une association
export function useAssociationMissions(associationId: string | undefined, status?: MissionStatus | MissionStatus[]) {
  return useQuery({
    queryKey: ["association-missions", associationId, status],
    queryFn: async (): Promise<MissionWithDetails[] | null> => {
      if (!associationId) return null;
      
      let query = supabase
        .from("missions")
        .select(`
          *,
          mission_categories(category_id),
          mission_participants(
            id, 
            user_id,
            status,
            profiles:user_id(*)
          )
        `)
        .eq("association_id", associationId);
      
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
        const transformedData = data.map(mission => {
          const participants = mission.mission_participants || [];
          const participantsCount = participants.length;
          
          const transformed = {
            ...mission,
            participants_count: participantsCount,
            category: mission.skills_required?.[0] || 'Général',
            date: new Date(mission.starts_at).toLocaleDateString('fr-FR'),
            location: mission.address || `${mission.city}, ${mission.postal_code}`,
            timeSlot: new Date(mission.starts_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: `${Math.round(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 || ''}`,
            participants: mission.spots_taken.toString() + '/' + mission.spots_available.toString(),
            participants_list: participants,
          } as unknown as MissionWithDetails;
          
          return transformed;
        });
        
        return transformedData;
      }
      
      return null;
    },
    enabled: !!associationId
  });
}

// Hook pour récupérer les missions auxquelles participe un utilisateur
export function useUserMissions(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-missions", userId],
    queryFn: async (): Promise<MissionWithDetails[] | null> => {
      if (!userId) return null;
      
      const { data: participations, error } = await supabase
        .from("mission_participants")
        .select(`
          id,
          status,
          mission_id,
          mission:mission_id(
            *,
            association:association_id(*)
          )
        `)
        .eq("user_id", userId);
      
      if (error) throw error;
      
      if (participations) {
        // Extraire et transformer les missions
        const missions = participations.map(participation => {
          const mission = participation.mission as Mission;
          
          const transformed = {
            ...mission,
            participant_status: participation.status,
            participant_id: participation.id,
            is_registered: true,
            category: mission.skills_required?.[0] || 'Général',
            date: new Date(mission.starts_at).toLocaleDateString('fr-FR'),
            location: mission.address || `${mission.city}, ${mission.postal_code}`,
            timeSlot: new Date(mission.starts_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: `${Math.round(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 || ''}`,
            participants: mission.spots_taken.toString() + '/' + mission.spots_available.toString(),
            associationId: mission.association_id,
          } as unknown as MissionWithDetails;
          
          return transformed;
        });
        
        return missions;
      }
      
      return null;
    },
    enabled: !!userId
  });
}

// Hook pour récupérer les statistiques des missions pour le tableau de bord
export function useMissionStats(userId: string | undefined, isAssociation: boolean) {
  return useQuery({
    queryKey: ["mission-stats", userId, isAssociation],
    queryFn: async (): Promise<MissionStats | null> => {
      if (!userId) return null;
      
      if (isAssociation) {
        // Statistiques pour les associations
        const { data, error } = await supabase
          .from("missions")
          .select(`
            id,
            status,
            spots_taken,
            duration_minutes,
            mission_participants(id, status)
          `)
          .eq("association_id", userId);
          
        if (error) throw error;
        
        if (data) {
          const stats: MissionStats = {
            total: data.length,
            active: data.filter(m => ["open", "in_progress", "filled"].includes(m.status)).length,
            completed: data.filter(m => m.status === "completed").length,
            cancelled: data.filter(m => m.status === "cancelled").length,
            totalVolunteers: data.reduce((sum, m) => sum + (m.spots_taken || 0), 0),
            totalHours: data.reduce((sum, m) => sum + (m.duration_minutes || 0) / 60, 0)
          };
          
          return stats;
        }
      } else {
        // Statistiques pour les bénévoles
        const { data, error } = await supabase
          .from("mission_participants")
          .select(`
            id,
            status,
            mission:mission_id(duration_minutes)
          `)
          .eq("user_id", userId);
          
        if (error) throw error;
        
        if (data) {
          const stats: MissionStats = {
            total: data.length,
            active: data.filter(p => ["registered", "confirmed"].includes(p.status)).length,
            completed: data.filter(p => p.status === "completed").length,
            cancelled: data.filter(p => p.status === "cancelled").length,
            totalVolunteers: 0, // Non applicable pour les bénévoles
            totalHours: data.reduce((sum, p) => {
              if (p.status === "completed" && p.mission) {
                return sum + (p.mission.duration_minutes || 0) / 60;
              }
              return sum;
            }, 0)
          };
          
          return stats;
        }
      }
      
      return null;
    },
    enabled: !!userId
  });
}

// Hook pour gérer les actions sur les missions (validation de participation, etc.)
export function useMissionActions() {
  const validateParticipation = async (participantId: string, attendance: boolean, feedback?: string, badges?: string[]) => {
    try {
      // 1. Mettre à jour le statut du participant
      const { error: participantError } = await supabase
        .from("mission_participants")
        .update({ 
          status: attendance ? "completed" : "no_show",
          feedback
        })
        .eq("id", participantId);
        
      if (participantError) throw participantError;
      
      // 2. Si présence validée et badges spécifiés, attribuer les badges
      if (attendance && badges && badges.length > 0) {
        // Récupérer l'ID du bénévole
        const { data: participant } = await supabase
          .from("mission_participants")
          .select("user_id, mission_id")
          .eq("id", participantId)
          .single();
          
        if (participant) {
          // Récupérer les IDs des badges par nom
          const { data: badgesData } = await supabase
            .from("badges")
            .select("id, name")
            .in("name", badges);
            
          if (badgesData) {
            // Préparer les données pour l'insertion des badges utilisateur
            const userBadges = badgesData.map(badge => ({
              user_id: participant.user_id,
              badge_id: badge.id
            }));
            
            // Vérifier si les badges existent déjà pour éviter les doublons
            for (const userBadge of userBadges) {
              const { count } = await supabase
                .from("user_badges")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userBadge.user_id)
                .eq("badge_id", userBadge.badge_id);
                
              if (count === 0) {
                await supabase
                  .from("user_badges")
                  .insert(userBadge);
              }
            }
            
            // Fix notifications creation - comment out the code that tries to access a non-existent table
            // We'll remove the references to the non-existent "notifications" table
            console.log(`Badges attribués pour la participation de ${participant.user_id}`);
            
            /* Commented out the code that accesses a non-existent table
            try {
              // Check if the notifications table exists first
              const { error: notifCheckError } = await supabase
                .from("notifications")
                .select("count")
                .limit(1);
                
              if (!notifCheckError) {
                await supabase.from("notifications").insert({
                  user_id: participant.user_id,
                  mission_id: participant.mission_id,
                  type: "feedback",
                  message: `Vous avez reçu ${badges.length} badge(s) pour votre participation !`,
                  read: false
                });
              } else {
                console.log("Notifications table doesn't exist - skipping notification creation");
              }
            } catch (error) {
              console.error("Error creating notification (table may not exist):", error);
              // Continue execution, this is not a critical error
            }
            */
          }
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      return { success: false, error };
    }
  };
  
  const changeMissionStatus = async (missionId: string, status: MissionStatus) => {
    try {
      const { error } = await supabase
        .from("missions")
        .update({ status })
        .eq("id", missionId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      return { success: false, error };
    }
  };
  
  const duplicateMission = async (missionId: string) => {
    try {
      // 1. Récupérer les détails de la mission
      const { data: mission, error: missionError } = await supabase
        .from("missions")
        .select("*, mission_categories(category_id)")
        .eq("id", missionId)
        .single();
        
      if (missionError) throw missionError;
      
      if (mission) {
        // 2. Créer une copie de la mission
        const { id, created_at, updated_at, mission_categories, ...missionData } = mission;
        
        // Mettre à jour certains champs
        const newMissionData = {
          ...missionData,
          title: `Copie de ${missionData.title}`,
          status: "draft",
          spots_taken: 0
        };
        
        const { data: newMission, error: insertError } = await supabase
          .from("missions")
          .insert(newMissionData)
          .select();
          
        if (insertError) throw insertError;
        
        if (newMission && mission_categories) {
          // 3. Copier les catégories associées
          const newCategories = mission_categories.map((mc: any) => ({
            mission_id: newMission[0].id,
            category_id: mc.category_id
          }));
          
          await supabase
            .from("mission_categories")
            .insert(newCategories);
        }
        
        return { success: true, missionId: newMission[0].id };
      }
      
      return { success: false, error: "Mission introuvable" };
    } catch (error) {
      console.error("Erreur lors de la duplication :", error);
      return { success: false, error };
    }
  };
  
  return { validateParticipation, changeMissionStatus, duplicateMission };
}
