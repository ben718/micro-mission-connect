import React, { useState, useEffect } from 'react';
import { useMissionStore } from '../../stores/missionStore';
import { useAuthStore } from '../../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchUserMissions } = useMissionStore();
  
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    missionsCompleted: 0,
    totalHours: 0,
    impactScore: 0
  });
  
  useEffect(() => {
    const loadMissions = async () => {
      const missions = await fetchUserMissions();
      setUserMissions(missions);
      
      // Calculer les statistiques
      setStats({
        missionsCompleted: missions.length,
        totalHours: missions.reduce((acc: number, mission: any) => acc + (mission.duration || 0), 0) / 60,
        impactScore: missions.length * 10
      });
    };
    
    loadMissions();
  }, [fetchUserMissions]);
  
  // Badges fictifs pour la démonstration
  const badges = [
    { id: 1, name: 'Première mission', icon: '🌟', description: 'A complété sa première mission' },
    { id: 2, name: 'Polyglotte', icon: '🗣️', description: 'Parle plusieurs langues' },
    { id: 3, name: 'Héros local', icon: '🦸', description: 'A complété 5 missions dans sa ville' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl mb-4 md:mb-0 md:mr-6">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}</span>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-600">Bénévole depuis {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
              
              {user?.languages && user.languages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.languages.map((lang: string) => (
                    <span key={lang} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Missions complétées</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.missionsCompleted}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Heures de bénévolat</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.totalHours.toFixed(1)}h</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Score d'impact</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.impactScore}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mes badges</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className="border border-gray-200 rounded-lg p-4 flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Paramètres du profil</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Parlez-nous de vous..."
                defaultValue={user?.bio || ''}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Votre numéro de téléphone"
                defaultValue={user?.phone || ''}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Votre adresse"
                defaultValue={user?.address || ''}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Votre ville"
                  defaultValue={user?.city || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Votre code postal"
                  defaultValue={user?.postal_code || ''}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
