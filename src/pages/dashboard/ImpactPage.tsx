
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Heart } from 'lucide-react';

const ImpactPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Impact</h1>
        <p className="text-gray-600">Découvrez l'impact de votre engagement</p>
      </div>

      {/* Main Stats */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques globales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-vs-blue-light/20 rounded-lg">
            <Users className="h-8 w-8 text-vs-blue-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-vs-blue-primary">12</p>
            <p className="text-sm text-gray-600">Personnes aidées</p>
          </div>
          <div className="text-center p-4 bg-vs-green-light/20 rounded-lg">
            <Clock className="h-8 w-8 text-vs-green-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-vs-green-secondary">3h 15min</p>
            <p className="text-sm text-gray-600">Temps donné</p>
          </div>
          <div className="text-center p-4 bg-vs-orange-light/20 rounded-lg">
            <Heart className="h-8 w-8 text-vs-orange-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-vs-orange-accent">5</p>
            <p className="text-sm text-gray-600">Missions réalisées</p>
          </div>
          <div className="text-center p-4 bg-purple-100 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">85%</p>
            <p className="text-sm text-gray-600">Taux de participation</p>
          </div>
        </div>
      </motion.div>

      {/* Impact by Category */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact par catégorie</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-vs-orange-accent mr-3"></div>
              <span className="text-sm font-medium text-gray-900">Alimentaire</span>
            </div>
            <span className="text-sm text-gray-600">3 missions</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-vs-green-secondary mr-3"></div>
              <span className="text-sm font-medium text-gray-900">Social</span>
            </div>
            <span className="text-sm text-gray-600">2 missions</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accomplissements récents</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-vs-green-light flex items-center justify-center mr-3">
              <Heart className="h-5 w-5 text-vs-green-dark" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Badge "Premier pas" débloqué</p>
              <p className="text-sm text-gray-600">Première mission accomplie</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactPage;
