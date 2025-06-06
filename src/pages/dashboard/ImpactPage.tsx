
import React from 'react';
import { motion } from 'framer-motion';
import { useMissionStore } from '../../stores/missionStore';

const ImpactPage: React.FC = () => {
  const { missions } = useMissionStore();

  // Calcul du nombre de missions auxquelles l'utilisateur s'est inscrit
  const userMissions = missions
    ? missions.filter(mission => mission.registration_status === 'accepted').length
    : 0;

  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Impact</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistiques personnelles */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vos Statistiques</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Missions accomplies</span>
              <span className="font-medium text-vs-blue-primary">{userMissions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heures de bénévolat</span>
              <span className="font-medium text-vs-blue-primary">{userMissions * 4}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Personnes aidées</span>
              <span className="font-medium text-vs-blue-primary">67</span>
            </div>
          </div>
        </div>

        {/* Badges obtenus */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges Obtenus</h2>
          <div className="flex flex-wrap gap-2">
            <span className="badge-green">🏆 Première mission</span>
            <span className="badge-blue">📚 Aide aux devoirs</span>
            <span className="badge-orange">🍽️ Distribution alimentaire</span>
          </div>
        </div>

        {/* Impact communautaire */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Communautaire</h2>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">+15%</div>
            <p className="text-sm text-gray-600">Augmentation de votre contribution ce mois</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactPage;
