
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const ImpactPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Impact</h1>
      
      <div className="grid gap-6">
        {/* Statistiques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-vs-blue-primary">42</h3>
            <p className="text-sm text-gray-600">Missions réalisées</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-vs-green-primary">156h</h3>
            <p className="text-sm text-gray-600">Temps donné</p>
          </div>
        </div>
        
        {/* Badges */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes badges</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🌟</span>
              </div>
              <p className="text-xs text-gray-600">Première mission</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-xs text-gray-600">10 missions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-xs text-gray-600">Réactif</p>
            </div>
          </div>
        </div>
        
        {/* Historique récent */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Missions récentes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Aide aux devoirs</h3>
                <p className="text-sm text-gray-600">École primaire Jules Ferry</p>
              </div>
              <span className="text-xs text-gray-500">Il y a 2 jours</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Distribution alimentaire</h3>
                <p className="text-sm text-gray-600">Restos du Cœur</p>
              </div>
              <span className="text-xs text-gray-500">Il y a 1 semaine</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactPage;
