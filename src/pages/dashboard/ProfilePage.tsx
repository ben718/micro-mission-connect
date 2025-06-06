
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
      
      {/* Photo et informations principales */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-vs-blue-primary">Bénévole actif</p>
          </div>
        </div>
        
        <button className="btn-outline w-full">
          Modifier le profil
        </button>
      </div>
      
      {/* Statistiques */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes statistiques</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-vs-blue-primary">42</p>
            <p className="text-sm text-gray-600">Missions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-vs-green-primary">156h</p>
            <p className="text-sm text-gray-600">Bénévolat</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-vs-orange-primary">4.8</p>
            <p className="text-sm text-gray-600">Note</p>
          </div>
        </div>
      </div>
      
      {/* Paramètres */}
      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Gérer vos préférences</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Confidentialité</h3>
              <p className="text-sm text-gray-600">Gérer vos données</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Aide et support</h3>
              <p className="text-sm text-gray-600">Obtenir de l'aide</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <button className="btn-outline-red w-full">
          Se déconnecter
        </button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
