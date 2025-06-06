
import React from 'react';
import { motion } from 'framer-motion';

const AssociationReportsPage: React.FC = () => {
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rapports d'Impact</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistiques générales */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Générales</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Missions créées</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bénévoles impliqués</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heures de bénévolat</span>
              <span className="font-medium">1,248h</span>
            </div>
          </div>
        </div>

        {/* Missions populaires */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Missions Populaires</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Distribution alimentaire</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-vs-blue-primary h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Aide aux devoirs</span>
                <span className="text-sm font-medium">76%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-vs-blue-primary h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact récent */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Récent</h2>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-vs-blue-primary">324</div>
              <div className="text-sm text-gray-600">Personnes aidées ce mois</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssociationReportsPage;
