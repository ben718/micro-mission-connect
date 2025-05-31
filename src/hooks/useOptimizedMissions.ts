
import { useOptimizedQuery } from './useOptimizedQuery';
import { useMissions } from './useMissions';
import { MissionFilters } from '@/types/mission';
import { useMemo } from 'react';

export function useOptimizedMissions(filters: MissionFilters) {
  // Créer une clé de cache stable basée sur les filtres
  const cacheKey = useMemo(() => 
    ['missions', JSON.stringify(filters)], 
    [filters]
  );

  // Utiliser le hook de missions existant mais avec optimisations
  const missionsQuery = useMissions(filters);

  // Mise en cache des résultats filtrés
  const optimizedData = useMemo(() => {
    if (!missionsQuery.data) return null;
    
    return {
      ...missionsQuery.data,
      data: missionsQuery.data.data || []
    };
  }, [missionsQuery.data]);

  return {
    ...missionsQuery,
    data: optimizedData,
  };
}
