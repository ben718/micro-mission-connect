import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Types pour le tracking des missions
interface MissionStatus {
  id: string;
  status: 'pending' | 'accepted' | 'on_way' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  volunteer_id: string;
  mission_id: string;
  started_at?: Date;
  arrived_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  estimated_arrival?: Date;
  actual_duration?: number; // en minutes
  notes?: string;
}

interface LiveMissionTracking {
  mission: {
    id: string;
    title: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    organization: string;
    contact_person?: string;
    contact_phone?: string;
  };
  status: MissionStatus;
  volunteer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    phone?: string;
  };
  timeline: {
    timestamp: Date;
    status: string;
    message: string;
    location?: { lat: number; lng: number };
  }[];
  realTimeUpdates: boolean;
}

// Hook pour le tracking des missions en temps réel
export const useMissionTracking = (missionId?: string) => {
  const { user } = useAuth();
  const [activeMissions, setActiveMissions] = useState<LiveMissionTracking[]>([]);
  const [currentMission, setCurrentMission] = useState<LiveMissionTracking | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Missions d'exemple pour la démo
  const sampleMissions: LiveMissionTracking[] = [
    {
      mission: {
        id: '1',
        title: 'Distribution alimentaire urgente',
        description: 'Aide pour distribuer des repas aux personnes en difficulté',
        address: '15 rue de la République, 75011 Paris',
        latitude: 48.8566,
        longitude: 2.3522,
        organization: 'Restos du Cœur',
        contact_person: 'Marie Dubois',
        contact_phone: '+33 1 23 45 67 89'
      },
      status: {
        id: 'status_1',
        status: 'on_way',
        volunteer_id: user?.id || 'volunteer_1',
        mission_id: '1',
        started_at: new Date(Date.now() - 10 * 60 * 1000), // Il y a 10 minutes
        estimated_arrival: new Date(Date.now() + 5 * 60 * 1000), // Dans 5 minutes
        location: {
          latitude: 48.8556,
          longitude: 2.3512,
          timestamp: new Date()
        }
      },
      volunteer: {
        id: user?.id || 'volunteer_1',
        name: 'Vous',
        rating: 4.8
      },
      timeline: [
        {
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          status: 'accepted',
          message: 'Mission acceptée'
        },
        {
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          status: 'on_way',
          message: 'En route vers la mission',
          location: { lat: 48.8556, lng: 2.3512 }
        }
      ],
      realTimeUpdates: true
    }
  ];

  // Démarrer le tracking de géolocalisation
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) return false;

    setIsTracking(true);
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        
        // Mettre à jour la position dans la mission active
        if (currentMission) {
          updateMissionLocation(currentMission.mission.id, newLocation);
        }
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, [currentMission]);

  // Mettre à jour la position pour une mission
  const updateMissionLocation = useCallback((missionId: string, location: { lat: number; lng: number }) => {
    setActiveMissions(prev => 
      prev.map(mission => 
        mission.mission.id === missionId
          ? {
              ...mission,
              status: {
                ...mission.status,
                location: {
                  latitude: location.lat,
                  longitude: location.lng,
                  timestamp: new Date()
                }
              }
            }
          : mission
      )
    );
  }, []);

  // Changer le statut d'une mission
  const updateMissionStatus = useCallback((
    missionId: string, 
    newStatus: MissionStatus['status'],
    notes?: string
  ) => {
    const now = new Date();
    
    setActiveMissions(prev => 
      prev.map(mission => {
        if (mission.mission.id !== missionId) return mission;
        
        const updatedStatus = { ...mission.status, status: newStatus };
        const newTimelineEntry = {
          timestamp: now,
          status: newStatus,
          message: getStatusMessage(newStatus),
          location: userLocation || undefined
        };

        // Mettre à jour les timestamps selon le statut
        switch (newStatus) {
          case 'arrived':
            updatedStatus.arrived_at = now;
            break;
          case 'in_progress':
            if (!updatedStatus.arrived_at) updatedStatus.arrived_at = now;
            break;
          case 'completed':
            updatedStatus.completed_at = now;
            if (updatedStatus.started_at) {
              updatedStatus.actual_duration = Math.round(
                (now.getTime() - updatedStatus.started_at.getTime()) / (1000 * 60)
              );
            }
            break;
          case 'cancelled':
            updatedStatus.cancelled_at = now;
            break;
        }

        if (notes) {
          updatedStatus.notes = notes;
        }

        return {
          ...mission,
          status: updatedStatus,
          timeline: [...mission.timeline, newTimelineEntry]
        };
      })
    );
  }, [userLocation]);

  // Obtenir le message pour un statut
  const getStatusMessage = (status: MissionStatus['status']): string => {
    switch (status) {
      case 'pending': return 'Mission en attente de confirmation';
      case 'accepted': return 'Mission acceptée';
      case 'on_way': return 'En route vers la mission';
      case 'arrived': return 'Arrivé sur le lieu de la mission';
      case 'in_progress': return 'Mission en cours';
      case 'completed': return 'Mission terminée avec succès';
      case 'cancelled': return 'Mission annulée';
      default: return 'Statut inconnu';
    }
  };

  // Calculer la distance entre deux points
  const calculateDistance = useCallback((
    lat1: number, lng1: number, 
    lat2: number, lng2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Calculer l'ETA (temps d'arrivée estimé)
  const calculateETA = useCallback((
    fromLat: number, fromLng: number,
    toLat: number, toLng: number,
    speedKmh: number = 4 // Vitesse de marche par défaut
  ): Date => {
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
    const timeHours = distance / speedKmh;
    const timeMs = timeHours * 60 * 60 * 1000;
    return new Date(Date.now() + timeMs);
  }, [calculateDistance]);

  // Rejoindre une mission
  const joinMission = useCallback((missionData: any) => {
    const newMission: LiveMissionTracking = {
      mission: missionData,
      status: {
        id: `status_${Date.now()}`,
        status: 'accepted',
        volunteer_id: user?.id || 'volunteer',
        mission_id: missionData.id,
        started_at: new Date()
      },
      volunteer: {
        id: user?.id || 'volunteer',
        name: user?.email?.split('@')[0] || 'Bénévole',
        rating: 4.5
      },
      timeline: [{
        timestamp: new Date(),
        status: 'accepted',
        message: 'Mission acceptée'
      }],
      realTimeUpdates: true
    };

    setActiveMissions(prev => [...prev, newMission]);
    setCurrentMission(newMission);
    
    // Démarrer le tracking automatiquement
    startLocationTracking();
    
    return newMission;
  }, [user, startLocationTracking]);

  // Quitter une mission
  const leaveMission = useCallback((missionId: string, reason?: string) => {
    updateMissionStatus(missionId, 'cancelled', reason);
    
    // Retirer de la liste des missions actives après un délai
    setTimeout(() => {
      setActiveMissions(prev => prev.filter(m => m.mission.id !== missionId));
      if (currentMission?.mission.id === missionId) {
        setCurrentMission(null);
        setIsTracking(false);
      }
    }, 2000);
  }, [updateMissionStatus, currentMission]);

  // Initialisation avec des données d'exemple
  useEffect(() => {
    if (user && missionId) {
      const mission = sampleMissions.find(m => m.mission.id === missionId);
      if (mission) {
        setActiveMissions([mission]);
        setCurrentMission(mission);
      }
    }
  }, [user, missionId]);

  // Simulation de mises à jour en temps réel
  useEffect(() => {
    if (activeMissions.length === 0) return;

    const interval = setInterval(() => {
      // Simuler des mises à jour de statut automatiques
      setActiveMissions(prev => 
        prev.map(mission => {
          if (!mission.realTimeUpdates) return mission;
          
          // Simuler l'arrivée automatique si on est proche
          if (mission.status.status === 'on_way' && userLocation) {
            const distance = calculateDistance(
              userLocation.lat, userLocation.lng,
              mission.mission.latitude, mission.mission.longitude
            );
            
            if (distance < 0.1) { // Moins de 100m
              return {
                ...mission,
                status: { ...mission.status, status: 'arrived', arrived_at: new Date() },
                timeline: [...mission.timeline, {
                  timestamp: new Date(),
                  status: 'arrived',
                  message: 'Arrivé sur le lieu de la mission',
                  location: userLocation
                }]
              };
            }
          }
          
          return mission;
        })
      );
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [activeMissions, userLocation, calculateDistance]);

  return {
    activeMissions,
    currentMission,
    isTracking,
    userLocation,
    startLocationTracking,
    updateMissionStatus,
    joinMission,
    leaveMission,
    calculateDistance,
    calculateETA
  };
};

