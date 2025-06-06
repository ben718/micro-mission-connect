import React, { useState, useEffect } from 'react';
import { useMissionStore } from '../../stores/missionStore';
import { useAuthStore } from '../../stores/authStore';
import type { SupabaseData } from '../../lib/mappers';

const ImpactPage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchUserMissions } = useMissionStore();
  
  const [userMissions, setUserMissions] = useState<SupabaseData[]>([]);
  const [stats, setStats] = useState({
    missionsCompleted: 0,
    totalHours: 0,
    peopleHelped: 0,
    organizationsSupported: 0
  });
  
  useEffect(() => {
    const loadMissions = async () => {
      const missions = await fetchUserMissions();
      setUserMissions(missions);
      
      // Calculer les statistiques
      setStats({
        missionsCompleted: missions.length,
        totalHours: missions.reduce((acc: number, mission: SupabaseData) => acc + (mission.duration || 0), 0) / 60,
        peopleHelped: missions.length * 5, // Estimation fictive
        organizationsSupported: new Set(missions.map((m: SupabaseData) => m.association_id)).size
      });
    };
    
    loadMissions();
  }, [fetchUserMissions]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon impact</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Missions complétées</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.missionsCompleted}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Heures de bénévolat</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.totalHours.toFixed(1)}h</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Personnes aidées</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.peopleHelped}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Associations soutenues</h2>
          <p className="text-3xl font-bold text-primary-600">{stats.organizationsSupported}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Évolution de mon impact</h2>
          
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique d'évolution de votre impact au fil du temps</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Répartition par catégorie</h2>
            
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graphique de répartition par catégorie de mission</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Objectifs d'impact</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">10 missions complétées</span>
                  <span className="text-sm font-medium">{Math.min(stats.missionsCompleted / 10, 1) * 100}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(stats.missionsCompleted / 10, 1) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">50 heures de bénévolat</span>
                  <span className="text-sm font-medium">{Math.min(stats.totalHours / 50, 1) * 100}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(stats.totalHours / 50, 1) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">5 associations soutenues</span>
                  <span className="text-sm font-medium">{Math.min(stats.organizationsSupported / 5, 1) * 100}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(stats.organizationsSupported / 5, 1) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;
