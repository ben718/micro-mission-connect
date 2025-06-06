
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, MapPin, Star, Award } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-vs-blue-primary flex items-center justify-center text-white text-xl font-bold mr-4">
              JD
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Jean Dupont</h2>
              <p className="text-sm text-gray-600">Membre depuis juin 2025</p>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">Paris 19ème</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <button className="w-full btn-secondary">
          Modifier mon profil
        </button>
      </motion.div>

      {/* Impact Stats */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mon impact</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-vs-blue-primary">5</p>
            <p className="text-sm text-gray-600">Missions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-vs-green-secondary">3h</p>
            <p className="text-sm text-gray-600">Temps donné</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-vs-orange-accent">2</p>
            <p className="text-sm text-gray-600">Associations</p>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mes badges</h3>
          <button className="text-sm text-vs-blue-primary">Voir tout</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto">
          <div className="flex flex-col items-center min-w-0">
            <div className="h-16 w-16 rounded-full bg-vs-orange-light flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-vs-orange-dark" />
            </div>
            <span className="text-xs text-gray-600">Premier pas</span>
          </div>
          <div className="flex flex-col items-center min-w-0">
            <div className="h-16 w-16 rounded-full bg-vs-green-light flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-vs-green-dark" />
            </div>
            <span className="text-xs text-gray-600">Alimentaire</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
