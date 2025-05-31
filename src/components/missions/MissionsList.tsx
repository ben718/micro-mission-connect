
import React, { useState } from 'react';
import { useOptimizedMissions } from '@/hooks/useOptimizedMissions';
import { MissionCard } from '@/components/mission/MissionCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MissionFilters } from './MissionFilters';
import { useMissionFilters } from '@/hooks/useMissionFilters';

const MissionsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filters, updateFilters } = useMissionFilters();
  
  const {
    data: missions,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useOptimizedMissions({
    ...filters,
    page: currentPage,
    limit: 12
  });

  const allMissions = missions?.pages.flatMap(page => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <MissionFilters onFiltersChange={updateFilters} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <MissionFilters onFiltersChange={updateFilters} />
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Une erreur est survenue lors du chargement des missions.
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MissionFilters onFiltersChange={updateFilters} />
      
      {allMissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Aucune mission trouvée avec ces critères.
          </p>
          <Button onClick={() => updateFilters({})}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  'Charger plus de missions'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MissionsList;
