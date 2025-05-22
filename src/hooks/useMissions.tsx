import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionFilters, MissionWithAssociation, MissionWithDetails, Association } from "@/types/mission";

export function useMissions(filters?: MissionFilters) {
  const pageSize = filters?.pageSize || 12; // Default page size
  const page = filters?.page || 0; // Default to first page (0-indexed)
  const start = page * pageSize;
  const end = start + pageSize - 1;

  return useQuery({
    queryKey: ["missions", filters?.query, filters?.city, filters?.categoryIds, filters?.dateRange, filters?.remote, page, pageSize],
    queryFn: async (): Promise<{ data: MissionWithAssociation[] | null, count: number | null }> => {
      let query = supabase
        .from("missions")
        .select(`
          *,
          association:association_id(*)
        `, { count: 'exact' })
        .eq("status", "open");
      
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
          // On filtre les missions dont l'ID est présent dans la table mission_categories
          // où category_id est dans la liste des filtres.
          // Cela nécessite de joindre implicitement ou explicitement.
          // Supabase permet de filtrer à travers les relations.
          query = query.filter('mission_categories.category_id', 'in', filters.categoryIds);
        }
      }
      
      // Appliquer la pagination
      query = query.range(start, end);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Ici, nous devons transformer les données pour correspondre à l'interface MissionWithAssociation
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
