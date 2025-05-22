import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchFilters, type SearchFilters as SearchFiltersType } from '@/components/search/SearchFilters';
import { MissionCard } from '@/components/mission/MissionCard';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MissionWithAssociation } from '@/types/mission';

export function Missions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { data, isLoading } = useMissions();
  const missions: MissionWithAssociation[] = data?.data || [];

  // Convertir les paramètres d'URL en filtres
  const initialFilters: SearchFiltersType = {
    query: searchParams.get('q') || '',
    category: searchParams.get('category')?.split(',') || [],
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || '',
    remote: searchParams.get('remote') === 'true',
    skills: searchParams.get('skills')?.split(',') || []
  };

  const handleSearch = (filters: SearchFiltersType) => {
    const newParams = new URLSearchParams();
    
    if (filters.query) newParams.set('q', filters.query);
    if (filters.category.length > 0) newParams.set('category', filters.category.join(','));
    if (filters.location) newParams.set('location', filters.location);
    if (filters.date) newParams.set('date', filters.date);
    if (filters.remote) newParams.set('remote', 'true');
    if (filters.skills.length > 0) newParams.set('skills', filters.skills.join(','));

    setSearchParams(newParams);
  };

  // Filtrer les missions en fonction des paramètres de recherche
  const filteredMissions = React.useMemo(() => {
    return missions.filter(mission => {
      // Filtre par recherche textuelle
      if (initialFilters.query && !mission.title.toLowerCase().includes(initialFilters.query.toLowerCase())) {
        return false;
      }

      // Filtre par catégorie
      if (initialFilters.category.length > 0 && !initialFilters.category.some(cat => mission.categories?.includes(cat))) {
        return false;
      }

      // Filtre par ville
      if (initialFilters.location && mission.city !== initialFilters.location) {
        return false;
      }

      // Filtre par date
      if (initialFilters.date) {
        const missionDate = new Date(mission.starts_at);
        const filterDate = new Date(initialFilters.date);
        if (missionDate.toDateString() !== filterDate.toDateString()) {
          return false;
        }
      }

      // Filtre par compétences
      if (initialFilters.skills.length > 0 && !initialFilters.skills.some(skill => mission.skills_required?.includes(skill))) {
        return false;
      }

      return true;
    });
  }, [missions, initialFilters]);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Missions disponibles</h1>
        {user?.role === 'association' && (
          <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Créer une mission
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Sidebar avec filtres */}
        <div className="lg:col-span-1">
          <SearchFilters 
            onSearch={handleSearch} 
            initialFilters={initialFilters}
            totalResults={filteredMissions.length}
          />
        </div>

        {/* Liste des missions */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-8">Chargement des missions...</div>
          ) : filteredMissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">Aucune mission ne correspond à vos critères.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchParams({})}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-all duration-300">
              {filteredMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 