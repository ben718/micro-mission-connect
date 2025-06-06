
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMissionStore } from '../../stores/tempMissionStore';
import { Link } from 'react-router-dom';

const ExplorePage: React.FC = () => {
  const { 
    missions, 
    fetchMissions, 
    loading, 
    filters, 
    setFilter, 
    resetFilters 
  } = useMissionStore();
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);
  
  // Filtrage des missions
  const filteredMissions = missions.filter(mission => {
    // Filtre par disponibilité
    if (filters.timing === 'now' && mission.timing !== 'now' && mission.timing !== 'soon') {
      return false;
    } else if (filters.timing === 'planned' && (mission.timing === 'now' || mission.timing === 'soon')) {
      return false;
    }
    
    // Filtre par durée
    if (filters.duration !== null) {
      if (filters.duration === 15 && mission.duration > 15) return false;
      if (filters.duration === 30 && (mission.duration < 16 || mission.duration > 30)) return false;
      if (filters.duration === 60 && mission.duration <= 30) return false;
    }
    
    // Filtre par catégorie
    if (filters.category !== null && mission.category !== filters.category) {
      return false;
    }
    
    // Filtre par distance
    if (filters.distance !== null && mission.distance && mission.distance > filters.distance) {
      return false;
    }
    
    return true;
  });
  
  // Formatage du timing
  const getTimingText = (timing?: string) => {
    if (timing === 'now') {
      return 'Maintenant';
    } else if (timing === 'soon') {
      return 'Bientôt';
    } else {
      return timing || 'À planifier';
    }
  };
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Explorer les missions</h1>
      
      {/* Filtres principaux */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            filters.timing === 'now'
              ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setFilter('timing', filters.timing === 'now' ? null : 'now')}
        >
          Disponible maintenant
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            filters.timing === 'planned'
              ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setFilter('timing', filters.timing === 'planned' ? null : 'planned')}
        >
          Planifier
        </button>
      </div>
      
      {/* Filtres secondaires */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filters.duration === 15
              ? 'bg-vs-blue-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setFilter('duration', filters.duration === 15 ? null : 15)}
        >
          15 min
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filters.duration === 30
              ? 'bg-vs-blue-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setFilter('duration', filters.duration === 30 ? null : 30)}
        >
          30 min
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-full ${
            filters.duration === 60
              ? 'bg-vs-blue-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setFilter('duration', filters.duration === 60 ? null : 60)}
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-vs-blue-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">
              {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} trouvée{filteredMissions.length !== 1 ? 's' : ''}
            </p>
            
            {viewMode === 'list' ? (
              <div>
                {filteredMissions.map(mission => (
                  <motion.div 
                    key={mission.id}
                    className="card hover:cursor-pointer mb-4"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {}}
                  >
                    <Link to={`/app/missions/${mission.id}`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                          <p className="text-sm text-gray-600">{mission.association_name}</p>
                        </div>
                        <span className={mission.duration <= 15 ? 'badge-orange' : mission.duration <= 30 ? 'badge-green' : 'badge-blue'}>
                          {mission.duration} min
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-3">{mission.distance || 0} km</span>
                        <span>{getTimingText(mission.timing)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {mission.spots_taken}/{mission.spots_available} places
                        </span>
                        
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-vs-blue-primary h-1.5 rounded-full" 
                            style={{ width: `${(mission.spots_taken / mission.spots_available) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {mission.category}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                {filteredMissions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Aucune mission ne correspond à vos critères</p>
                    <button 
                      className="btn-secondary"
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">Carte des missions à proximité</p>
                {/* Dans une implémentation réelle, intégrer une carte interactive ici */}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ExplorePage;
