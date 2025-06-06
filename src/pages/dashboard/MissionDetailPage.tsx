import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMissionStore } from '../../stores/missionStore';

const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const { 
    getMission, 
    registerForMission, 
    cancelMissionRegistration, 
    userMissions 
  } = useMissionStore();
  
  const mission = getMission(id || '');
  const isRegistered = userMissions.includes(id || '');
  
  useEffect(() => {
    if (!mission) {
      // Rediriger si la mission n'existe pas
      navigate('/app/explore');
    }
  }, [mission, navigate]);
  
  if (!mission) {
    return null; // Ou un composant de chargement
  }
  
  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await registerForMission(mission.id);
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleCancelRegistration = async () => {
    setIsCancelling(true);
    try {
      await cancelMissionRegistration(mission.id);
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Formatage du timing - commenté car non utilisé pour éviter l'erreur TS
  // const getTimingText = () => {
  //   if (mission.timing === 'now') {
  //     return 'Maintenant';
  //   } else if (mission.timing === 'soon') {
  //     return 'Bientôt';
  //   } else {
  //     return mission.timing;
  //   }
  // };
  
  return (
    <motion.div 
      className="py-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* En-tête */}
      <div className="mb-6">
        <Link to="/app/explore" className="flex items-center text-vs-blue-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Retour aux missions</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{mission.title}</h1>
        <p className="text-gray-600">{mission.organization}</p>
      </div>

      {/* Informations principales */}
      <motion.div 
        className="card mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Détails de la mission</h2>
          </div>
          <span className={mission.duration <= 15 ? 'badge-orange' : mission.duration <= 30 ? 'badge-green' : 'badge-blue'}>
            {mission.duration} min
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="text-gray-600 mt-1">{mission.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date</h3>
              <p className="text-gray-600 mt-1">{mission.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Horaire</h3>
              <p className="text-gray-600 mt-1">{mission.time_start} - {mission.time_end}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Places</h3>
              <p className="text-gray-600 mt-1">{mission.spots.taken}/{mission.spots.available}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700">Adresse</h3>
            <p className="text-gray-600 mt-1">
              {mission.location.address}, {mission.location.postal_code} {mission.location.city}
            </p>
            <p className="text-sm text-vs-blue-primary mt-1">
              {mission.distance} km de votre position
            </p>
          </div>
          
          {mission.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Prérequis</h3>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                {mission.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700">Impact</h3>
            <p className="text-gray-600 mt-1">{mission.impact}</p>
          </div>
        </div>
      </motion.div>

      {/* Carte */}
      <motion.div 
        className="card p-0 overflow-hidden mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Carte de localisation</p>
          {/* Dans une implémentation réelle, intégrer une carte interactive ici */}
        </div>
      </motion.div>

      {/* Organisation */}
      <motion.div 
        className="card mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'organisation</h2>
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{mission.organization}</h3>
            <p className="text-sm text-gray-500">{mission.location.city}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Association engagée dans l'aide aux personnes en difficulté depuis plus de 10 ans.
        </p>
        <a 
          href="#"
          className="text-vs-blue-primary font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Visiter le site web
        </a>
      </motion.div>

      {/* Bouton d'action */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {isRegistered ? (
          <button 
            className={`btn-outline-red w-full flex justify-center items-center ${isCancelling ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleCancelRegistration}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Annulation en cours...
              </>
            ) : 'Annuler ma participation'}
          </button>
        ) : (
          <button 
            className={`btn-primary w-full flex justify-center items-center ${isRegistering ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleRegister}
            disabled={isRegistering || mission.spots.taken >= mission.spots.available}
          >
            {isRegistering ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription en cours...
              </>
            ) : mission.spots.taken >= mission.spots.available ? 'Mission complète' : 'Participer à cette mission'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MissionDetailPage;
