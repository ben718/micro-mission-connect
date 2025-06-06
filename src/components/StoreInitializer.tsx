
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useMissionStore } from '../stores/missionStore';

const StoreInitializer = () => {
  const { checkAuth } = useAuthStore();
  const { fetchMissions } = useMissionStore();
  
  useEffect(() => {
    // Initialiser les données au démarrage
    checkAuth();
    fetchMissions();
  }, [checkAuth, fetchMissions]);
  
  return null;
};

export default StoreInitializer;
