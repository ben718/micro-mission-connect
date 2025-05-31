
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { errorMonitoring } from "@/services/errorMonitoring";

interface OptimizedMissionFilters {
  limit?: number;
  offset?: number;
  location?: string;
  format?: string;
  difficulty_level?: string;
  engagement_level?: string;
  search?: string;
}

export function useOptimizedMissionQuery(filters: OptimizedMissionFilters = {}) {
  const queryClient = useQueryClient();

  // Créer une clé de cache stable
  const queryKey = useMemo(() => 
    ['optimized-missions', JSON.stringify(filters)],
    [filters]
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        console.log('🔍 Fetching missions with filters:', filters);
        
        let query = supabase
          .from('available_missions_details')
          .select(`
            mission_id,
            title,
            description,
            location,
            start_date,
            duration_minutes,
            available_spots,
            format,
            difficulty_level,
            engagement_level,
            organization_name,
            logo_url,
            image_url,
            sector_name,
            mission_type_name
          `)
          .eq('start_date', filters.search ? undefined : new Date().toISOString().split('T')[0])
          .order('start_date', { ascending: true });

        // Appliquer les filtres de manière optimisée
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        
        if (filters.format) {
          query = query.eq('format', filters.format);
        }
        
        if (filters.difficulty_level) {
          query = query.eq('difficulty_level', filters.difficulty_level);
        }
        
        if (filters.engagement_level) {
          query = query.eq('engagement_level', filters.engagement_level);
        }
        
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Pagination optimisée
        if (filters.limit) {
          query = query.limit(filters.limit);
        }
        
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) {
          errorMonitoring.reportError(error as Error, {
            component: 'OptimizedMissionQuery',
            severity: 'high',
            additionalData: { filters }
          });
          throw error;
        }

        console.log('✅ Missions fetched successfully:', data?.length);
        return data || [];
      } catch (error) {
        errorMonitoring.reportError(error as Error, {
          component: 'OptimizedMissionQuery',
          severity: 'critical',
          additionalData: { filters }
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      // Retry logic basé sur le type d'erreur
      if (failureCount >= 3) return false;
      
      const errorMessage = error?.message?.toLowerCase() || '';
      if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        return true; // Retry sur les erreurs réseau
      }
      
      return false; // Ne pas retry sur les erreurs de logique
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Prefetch pour la page suivante
  const prefetchNextPage = useMemo(() => {
    return () => {
      if (filters.limit && filters.offset !== undefined) {
        const nextFilters = {
          ...filters,
          offset: filters.offset + filters.limit
        };
        
        queryClient.prefetchQuery({
          queryKey: ['optimized-missions', JSON.stringify(nextFilters)],
          queryFn: async () => {
            // Même logique que ci-dessus mais pour la page suivante
            // ... (code similaire)
          },
          staleTime: 5 * 60 * 1000,
        });
      }
    };
  }, [filters, queryClient]);

  return {
    ...query,
    prefetchNextPage,
  };
}
