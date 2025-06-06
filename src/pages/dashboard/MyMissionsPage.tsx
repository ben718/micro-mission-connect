
import React from 'react';
import { motion } from 'framer-motion';

const MyMissionsPage: React.FC = () => {
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes Missions</h1>
      
      <div className="mb-6">
        {/* Onglets */}
        <div className="flex border-b border-gray-200">
          <button className="py-2 px-4 font-medium text-vs-blue-primary border-b-2 border-vs-blue-primary">
            À venir
          </button>
          <button className="py-2 px-4 font-medium text-gray-500">
            Terminées
          </button>
        </div>
      </div>
      
      {/* Missions à venir */}
      <div className="space-y-4">
        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Aide aux devoirs</h3>
              <p className="text-sm text-gray-600">École primaire Jules Ferry</p>
            </div>
            <span className="badge-green">Confirmé</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="mr-4">📅 Demain 14h-16h</span>
            <span>📍 2.5 km</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn-outline flex-1">
              Voir détails
            </button>
            <button className="btn-outline-red flex-1">
              Annuler
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Distribution alimentaire</h3>
              <p className="text-sm text-gray-600">Restos du Cœur</p>
            </div>
            <span className="badge-orange">En attente</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="mr-4">📅 Samedi 9h-12h</span>
            <span>📍 1.2 km</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn-outline flex-1">
              Voir détails
            </button>
            <button className="btn-outline-red flex-1">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyMissionsPage;
