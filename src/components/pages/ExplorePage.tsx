import React, { useState } from 'react';
import Button from '../common/Button';
import MissionCard from '../common/MissionCard';

interface Mission {
  id: string;
  title: string;
  organization: string;
  duration: number;
  distance: number;
  timing: 'now' | 'soon' | string;
  spots: {
    taken: number;
    available: number;
  };
  category: string;
}

const ExplorePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'now' | 'planned'>('now');
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Données de démonstration
  const missions: Mission[] = [
    {
      id: '1',
      title: 'Aide aux courses - Épicerie solidaire',
      organization: 'Les Restos du Cœur',
      duration: 15,
      distance: 0.5,
      timing: 'now',
      spots: {
        taken: 1,
        available: 3
      },
      category: 'Social'
    },
    {
      id: '2',
      title: 'Distribution de repas - Centre d\'accueil',
      organization: 'Secours Populaire',
      duration: 30,
      distance: 1.2,
      timing: 'soon',
      spots: {
        taken: 2,
        available: 5
      },
      category: 'Alimentaire'
    },
    {
      id: '3',
      title: 'Lecture aux enfants - Bibliothèque',
      organization: 'Lire et Faire Lire',
      duration: 15,
      distance: 0.8,
      timing: '14h30',
      spots: {
        taken: 0,
        available: 2
      },
      category: 'Éducation'
    },
    {
      id: '4',
      title: 'Nettoyage du parc - Journée verte',
      organization: 'Ville Propre',
      duration: 45,
      distance: 1.5,
      timing: 'now',
      spots: {
        taken: 3,
        available: 10
      },
      category: 'Environnement'
    }
  ];
  
  // Filtrage des missions
  const filteredMissions = missions.filter(mission => {
    // Filtre par disponibilité
    if (activeFilter === 'now' && mission.timing !== 'now' && mission.timing !== 'soon') {
      return false;
    }
    
    // Filtre par durée
    if (durationFilter !== null) {
      if (durationFilter === 15 && mission.duration > 15) return false;
      if (durationFilter === 30 && (mission.duration < 16 || mission.duration > 30)) return false;
      if (durationFilter === 60 && mission.duration <= 30) return false;
    }
    
    // Filtre par catégorie
    if (categoryFilter !== null && mission.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });
  
  // Navigation vers la page de détail d'une mission
  const handleMissionClick = (missionId: string) => {
    console.log(`Navigating to mission ${missionId}`);
    // Dans une implémentation réelle, utiliser react-router pour naviguer
    // navigate(`/app/missions/${missionId}`);
  };
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Explorer les missions</h1>
      
      {/* Filtres principaux */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeFilter === 'now'
              ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveFilter('now')}
        >
          Disponible maintenant
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeFilter === 'planned'
              ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveFilter('planned')}
        >
          Planifier
        </button>
      </div>
      
      {/* Filtres secondaires */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            durationFilter === 15
              ? 'bg-vs-blue-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setDurationFilter(durationFilter === 15 ? null : 15)}
        >
          15 min
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            durationFilter === 30
              ? 'bg-vs-blue-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setDurationFilter(durationFilter === 30 ? null : 30)}
        >
          30 min
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            durationFilter === 60
              ? 'bg-vs-blue-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setDurationFilter(durationFilter === 60 ? null : 60)}
        >
          1h+
        </button>
        
        <div className="ml-auto flex">
          <button
            className={`px-3 py-1 rounded-l-md ${
              viewMode === 'list'
                ? 'bg-vs-blue-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setViewMode('list')}
          >
            Liste
          </button>
          <button
            className={`px-3 py-1 rounded-r-md ${
              viewMode === 'map'
                ? 'bg-vs-blue-primary text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setViewMode('map')}
          >
            Carte
          </button>
        </div>
      </div>
      
      {/* Résultats */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">
          {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} trouvée{filteredMissions.length !== 1 ? 's' : ''}
        </p>
        
        {viewMode === 'list' ? (
          <div>
            {filteredMissions.map(mission => (
              <MissionCard
                key={mission.id}
                id={mission.id}
                title={mission.title}
                organization={mission.organization}
                duration={mission.duration}
                distance={mission.distance}
                timing={mission.timing}
                spots={mission.spots}
                category={mission.category}
                onClick={() => handleMissionClick(mission.id)}
              />
            ))}
            
            {filteredMissions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucune mission ne correspond à vos critères</p>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setDurationFilter(null);
                    setCategoryFilter(null);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Carte des missions à proximité</p>
            {/* Dans une implémentation réelle, intégrer une carte interactive ici */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
