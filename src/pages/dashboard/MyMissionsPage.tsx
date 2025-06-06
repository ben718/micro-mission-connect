
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

const MyMissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingMissions = [
    {
      id: '1',
      title: 'Distribution alimentaire',
      date: 'Aujourd\'hui',
      time: '12:30 - 12:45',
      location: 'Centre d\'accueil Paris 19',
      duration: 15,
      category: 'Alimentaire'
    },
    {
      id: '2',
      title: 'Nettoyage du parc',
      date: 'Samedi 12 juin',
      time: '10:00 - 11:00',
      location: 'Parc des Buttes-Chaumont',
      duration: 60,
      category: 'Environnement'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Missions</h1>
        <p className="text-gray-600">Gérez vos missions à venir et passées</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'upcoming'
                ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary bg-blue-50'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            À venir
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'past'
                ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary bg-blue-50'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Passées
          </button>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          <>
            <h2 className="text-lg font-semibold text-gray-900">Missions à venir</h2>
            {upcomingMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                className="bg-white rounded-xl p-4 shadow-card border-l-4 border-vs-orange-accent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{mission.title}</h3>
                  <span className="badge-orange">{mission.duration} min</span>
                </div>
                
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{mission.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{mission.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{mission.location}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="text-vs-blue-primary text-sm hover:underline">
                    Détails
                  </button>
                  <button className="bg-red-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-red-600 transition-colors">
                    Annuler
                  </button>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {activeTab === 'past' && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune mission passée pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMissionsPage;
