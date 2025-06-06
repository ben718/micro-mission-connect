
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter } from 'lucide-react';

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const missions = [
    {
      id: '1',
      title: 'Distribution alimentaire',
      description: 'Aider à distribuer des repas aux personnes sans-abri',
      duration: 15,
      distance: '500m',
      category: 'Alimentaire',
      borderColor: 'border-vs-orange-accent'
    },
    {
      id: '2',
      title: 'Lecture aux seniors',
      description: 'Lire le journal à des personnes âgées',
      duration: 30,
      distance: '1.2 km',
      category: 'Social',
      borderColor: 'border-vs-green-secondary'
    },
    {
      id: '3',
      title: 'Aide aux courses',
      description: 'Accompagner une personne âgée pour ses courses',
      duration: 45,
      distance: '800m',
      category: 'Aide',
      borderColor: 'border-vs-blue-primary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Explorer</h1>
        <p className="text-gray-600">Trouvez des missions près de chez vous</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Rechercher une mission..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vs-blue-primary focus:border-vs-blue-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Filter className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-vs-blue-primary mx-auto mb-2" />
          <p className="text-gray-600">Carte des missions</p>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Missions disponibles ({missions.length})</h2>
        
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            className={`bg-white rounded-xl p-4 shadow-card border-l-4 ${mission.borderColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">{mission.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                mission.category === 'Alimentaire' ? 'bg-vs-orange-light text-vs-orange-dark' :
                mission.category === 'Social' ? 'bg-vs-green-light text-vs-green-dark' :
                'bg-vs-blue-light text-vs-blue-dark'
              }`}>
                {mission.duration} min
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-xs">{mission.distance}</span>
              </div>
              <button className="btn-primary text-sm py-1 px-4">
                Je participe
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
