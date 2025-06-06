import React, { useState, useEffect } from 'react';
import { useMissionStore } from '../../stores/missionStore';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';

const MyMissionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    fetchUserMissions,
    cancelRegistration,
    isLoading 
  } = useMissionStore();
  
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  
  useEffect(() => {
    const loadMissions = async () => {
      const missions = await fetchUserMissions();
      setUserMissions(missions);
    };
    
    loadMissions();
  }, [fetchUserMissions]);
  
  // Diviser les missions en "à venir" et "passées" pour l'affichage
  const upcomingMissions = userMissions.filter((_: any, index: number) => index < 2);
  const pastMissions = userMissions.filter((_: any, index: number) => index >= 2);
  
  const handleCancelClick = (missionId: string) => {
    setSelectedMissionId(missionId);
    setCancelModalOpen(true);
  };
  
  const handleCancelConfirm = async () => {
    if (selectedMissionId) {
      await cancelRegistration(selectedMissionId, cancelReason);
      
      // Mettre à jour la liste des missions
      const missions = await fetchUserMissions();
      setUserMissions(missions);
      
      // Fermer le modal
      setCancelModalOpen(false);
      setSelectedMissionId(null);
      setCancelReason('');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes missions</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Missions à venir</h2>
            
            {upcomingMissions.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">Vous n'avez pas encore de missions à venir.</p>
                <Link to="/dashboard/explore" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Explorer les missions
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMissions.map((mission: any) => (
                  <div key={mission.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{mission.title}</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Confirmé
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-2">{mission.short_description}</p>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>{mission.date_start}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{mission.city}</span>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <Link to={`/dashboard/mission/${mission.id}`} className="text-primary-600 hover:text-primary-800">
                          Voir les détails
                        </Link>
                        <button 
                          onClick={() => handleCancelClick(mission.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Missions passées</h2>
            
            {pastMissions.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">Vous n'avez pas encore de missions passées.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastMissions.map((mission: any) => (
                  <div key={mission.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{mission.title}</h3>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          Terminé
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-2">{mission.short_description}</p>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>{mission.date_start}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{mission.city}</span>
                      </div>
                      
                      <div className="mt-4">
                        <Link to={`/dashboard/mission/${mission.id}`} className="text-primary-600 hover:text-primary-800">
                          Voir les détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
      
      {/* Modal d'annulation */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Annuler votre participation</h3>
            
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir annuler votre participation à cette mission ? 
              Veuillez indiquer la raison de votre annulation.
            </p>
            
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 mb-4"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Raison de l'annulation (facultatif)"
            ></textarea>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMissionsPage;
