
import React, { useState } from 'react';
import { useMissions } from '@/hooks/useMissions';
import { MissionCard } from '@/components/mission/MissionCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MissionFilters from './MissionFilters';
import { MissionFilters as MissionFiltersType } from '@/types/mission';

const MissionsList: React.FC = () => {
  const [filters, setFilters] = useState<MissionFiltersType>({
    query: "",
    location: "",
    format: undefined,
    difficulty_level: undefined,
    engagement_level: undefined,
    missionTypeIds: [],
    dateRange: undefined,
    page: 0,
    pageSize: 12
  });

  const {
    data: missionsResponse,
    isLoading,
    error
  } = useMissions(filters);

  const missions = missionsResponse?.data || [];
  const hasMore = missionsResponse ? (filters.page || 0) < Math.ceil(missionsResponse.count / (filters.pageSize || 12)) - 1 : false;

  const handleLoadMore = () => {
    setFilters(prev => ({
      ...prev,
      page: (prev.page || 0) + 1
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <MissionFilters onFiltersChange={setFilters} />
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
        <MissionFilters onFiltersChange={setFilters} />
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
      <MissionFilters onFiltersChange={setFilters} />
      
      {missions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Aucune mission trouvée avec ces critères.
          </p>
          <Button onClick={() => setFilters({ query: "", location: "", page: 0, pageSize: 12 })}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => {
              // Utiliser directement les données retournées par le hook useMissions
              // qui sont déjà transformées correctement
              return (
                <MissionCard key={mission.id} mission={mission} />
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                {isLoading ? (
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
