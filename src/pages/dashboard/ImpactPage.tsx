
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const ImpactPage: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Impact</h1>
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-vs-blue-primary mb-2">24</div>
          <div className="text-sm text-gray-600">Missions complétées</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">48h</div>
          <div className="text-sm text-gray-600">Heures de bénévolat</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
          <div className="text-sm text-gray-600">Personnes aidées</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
          <div className="text-sm text-gray-600">Note moyenne</div>
        </div>
      </div>

      {/* Badges */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes badges</h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-sm">
            🏆 Première mission
          </div>
          <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm">
            🎯 10 missions
          </div>
          <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-2 rounded-full text-sm">
            ⭐ Bénévole du mois
          </div>
          <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-2 rounded-full text-sm">
            💪 50h de bénévolat
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Prochains objectifs</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Atteindre 30 missions</span>
              <span className="text-sm text-gray-500">24/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-vs-blue-primary h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Atteindre 60h de bénévolat</span>
              <span className="text-sm text-gray-500">48/60h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactPage;
