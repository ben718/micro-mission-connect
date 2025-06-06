
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMissionStore } from '../../stores/missionStore';
import { missionService } from '../../lib/supabase';
import type { Mission } from '../../lib/types';

const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    registerForMission, 
    cancelMissionRegistration, 
    userMissions 
  } = useMissionStore();
  
  const isRegistered = userMissions.some(m => m.id === id);
  
  useEffect(() => {
    const fetchMission = async () => {
      if (!id) {
        navigate('/app/explore');
        return;
      }
      
      try {
        setLoading(true);
        const missionData = await missionService.getMissionById(id);
        setMission(missionData as Mission);
      } catch (error) {
        console.error('Error fetching mission:', error);
        navigate('/app/explore');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMission();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }
  
  if (!mission) {
    return null;
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
        <p className="text-gray-600">{mission.association_name}</p>
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
              <p className="text-gray-600 mt-1">{mission.spots_taken}/{mission.spots_available}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700">Adresse</h3>
            <p className="text-gray-600 mt-1">
              {mission.address}, {mission.postal_code} {mission.city}
            </p>
          </div>
          
          {mission.requirements && mission.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Prérequis</h3>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                {mission.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
            disabled={isRegistering || mission.spots_taken >= mission.spots_available}
          >
            {isRegistering ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription en cours...
              </>
            ) : mission.spots_taken >= mission.spots_available ? 'Mission complète' : 'Participer à cette mission'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MissionDetailPage;
