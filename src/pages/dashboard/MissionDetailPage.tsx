import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMissionStore } from '../../stores/missionStore';
import { useAuthStore } from '../../stores/authStore';

const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { missions, getMissionById, applyToMission } = useMissionStore();
  const { user } = useAuthStore();

  const mission = id ? getMissionById(id) : null;

  useEffect(() => {
    if (!id) {
      console.error("Mission ID is missing.");
      navigate('/app/explore');
      return;
    }
    
    if (!mission) {
      // Tenter de recharger les missions si l'ID est valide mais la mission n'est pas trouvée
      // Cela peut arriver si l'utilisateur arrive directement sur cette page sans passer par la liste des missions
      // et que le store n'est pas encore initialisé.
      // Vous pouvez commenter cette ligne si vous préférez ne pas recharger automatiquement.
      // fetchMissions();
    }
  }, [id, mission, navigate]);

  if (!mission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mission introuvable</h2>
          <p className="text-gray-600 mb-4">Cette mission n'existe pas ou a été supprimée.</p>
          <button 
            onClick={() => navigate('/app/explore')}
            className="btn-primary"
          >
            Retour à l'exploration
          </button>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    if (!user?.id || !mission?.id) return;
    
    try {
      await applyToMission(mission.id, user.id);
      // Afficher un message de succès
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
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
      {/* En-tête de la mission */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{mission.title}</h1>
            <p className="text-gray-600 mb-3">{mission.organization}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📅 {mission.timing}</span>
              <span>📍 {mission.distance}km</span>
              <span>⏱️ {mission.duration}h</span>
            </div>
          </div>
          {mission.image_url && (
            <img 
              src={mission.image_url} 
              alt={mission.title}
              className="w-24 h-24 object-cover rounded-lg ml-4"
            />
          )}
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleApply}
            className="btn-primary flex-1"
          >
            S'inscrire à cette mission
          </button>
          <button className="btn-outline">
            💬 Contacter
          </button>
        </div>
      </div>

      {/* Description détaillée */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-700 leading-relaxed">{mission.description}</p>
      </div>

      {/* Prérequis */}
      {mission.requirements && mission.requirements.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Prérequis</h2>
          <ul className="space-y-2">
            {mission.requirements.map((req, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Informations pratiques */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Informations pratiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">📍 Lieu</h3>
            <p className="text-gray-700">{mission.location?.address}</p>
            <p className="text-gray-700">{mission.location?.city} {mission.location?.postal_code}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">👥 Places disponibles</h3>
            <p className="text-gray-700">
              {mission.spots?.available - mission.spots?.taken} places restantes sur {mission.spots?.available}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionDetailPage;
