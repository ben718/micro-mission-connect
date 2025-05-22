import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchFilters, type SearchFilters as SearchFiltersType } from '@/components/search/SearchFilters';
import { MissionCard } from '@/components/mission/MissionCard';
import { useMissions } from '@/hooks/useMissions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Missions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: missions = [], isLoading } = useMissions();

  // Convertir les paramètres d'URL en filtres
  const initialFilters: SearchFiltersType = {
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || '',
    timeSlot: searchParams.get('timeSlot') || 'all',
    duration: searchParams.get('duration') || 'all',
    participants: searchParams.get('participants') || 'all',
    skills: searchParams.get('skills')?.split(',') || []
  };

  const handleSearch = (filters: SearchFiltersType) => {
    const newParams = new URLSearchParams();
    
    if (filters.query) newParams.set('q', filters.query);
    if (filters.category !== 'all') newParams.set('category', filters.category);
    if (filters.location) newParams.set('location', filters.location);
    if (filters.date) newParams.set('date', filters.date);
    if (filters.timeSlot !== 'all') newParams.set('timeSlot', filters.timeSlot);
    if (filters.duration !== 'all') newParams.set('duration', filters.duration);
    if (filters.participants !== 'all') newParams.set('participants', filters.participants);
    if (filters.skills.length > 0) newParams.set('skills', filters.skills.join(','));

    setSearchParams(newParams);
  };

  // Filtrer les missions en fonction des paramètres
  const filteredMissions = missions.filter(mission => {
    if (initialFilters.query && !mission.title.toLowerCase().includes(initialFilters.query.toLowerCase())) {
      return false;
    }
    if (initialFilters.category !== 'all' && mission.category !== initialFilters.category) {
      return false;
    }
    if (initialFilters.location && !mission.location.toLowerCase().includes(initialFilters.location.toLowerCase())) {
      return false;
    }
    if (initialFilters.date && mission.date !== initialFilters.date) {
      return false;
    }
    if (initialFilters.timeSlot !== 'all' && mission.timeSlot !== initialFilters.timeSlot) {
      return false;
    }
    if (initialFilters.duration !== 'all' && mission.duration !== initialFilters.duration) {
      return false;
    }
    if (initialFilters.participants !== 'all' && mission.participants !== initialFilters.participants) {
      return false;
    }
    if (initialFilters.skills.length > 0) {
      const hasRequiredSkills = initialFilters.skills.every(skill => 
        mission.requiredSkills.includes(skill)
      );
      if (!hasRequiredSkills) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Missions disponibles</h1>
        {user?.role === 'association' && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Créer une mission
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar avec filtres */}
        <div className="lg:col-span-1">
          <SearchFilters onSearch={handleSearch} initialFilters={initialFilters} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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