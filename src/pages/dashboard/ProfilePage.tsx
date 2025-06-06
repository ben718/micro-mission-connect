
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
      
      {/* Informations personnelles */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 rounded-full bg-vs-blue-primary flex items-center justify-center text-white text-xl font-bold mr-4">
            {user?.first_name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <button className="btn-outline w-full">
          Modifier mon profil
        </button>
      </div>

      {/* Statistiques */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-vs-blue-primary">24</div>
            <div className="text-sm text-gray-600">Missions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">48h</div>
            <div className="text-sm text-gray-600">Bénévolat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">156</div>
            <div className="text-sm text-gray-600">Personnes aidées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vs-blue-primary"></div>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Localisation</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vs-blue-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="btn-outline w-full">
          Aide & Support
        </button>
        <button className="btn-outline w-full">
          Conditions d'utilisation
        </button>
        <button 
          className="btn-outline-red w-full"
          onClick={handleLogout}
        >
          Se déconnecter
        </button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
