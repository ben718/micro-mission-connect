import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Types pour le système de matching
interface UserPreferences {
  categories: string[];
  maxDistance: number; // en km
  maxDuration: number; // en minutes
  urgencyLevels: ('low' | 'medium' | 'high')[];
  availableNow: boolean;
  notifications: boolean;
}

interface MatchedMission {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  distance: number;
  duration: number;
  urgency: 'low' | 'medium' | 'high';
  category: string;
  organization: string;
  matchScore: number; // 0-100
  matchReasons: string[];
  estimatedArrival: number; // minutes
}

interface MatchingResult {
  matches: MatchedMission[];
  totalMatches: number;
  lastUpdate: Date;
  isMatching: boolean;
}

// Hook pour le matching instantané
export const useInstantMatching = (userLocation: { lat: number; lng: number } | null) => {
  const { user, profile } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    categories: ['Aide alimentaire', 'Social', 'Environnement', 'Éducation'],
    maxDistance: 5,
    maxDuration: 120,
    urgencyLevels: ['low', 'medium', 'high'],
    availableNow: true,
    notifications: true
  });
  
  const [matchingResult, setMatchingResult] = useState<MatchingResult>({
    matches: [],
    totalMatches: 0,
    lastUpdate: new Date(),
    isMatching: false
  });

  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  // Missions d'exemple pour le matching
  const availableMissions = [
    {
      id: '1',
      title: 'Distribution alimentaire urgente',
      description: 'Aide pour distribuer des repas aux personnes en difficulté',
      latitude: 48.8566,
      longitude: 2.3522,
      duration: 45,
      urgency: 'high' as const,
      category: 'Aide alimentaire',
      organization: 'Restos du Cœur',
      created_at: new Date(),
      participants_needed: 5,
      participants_current: 2
    },
    {
      id: '2',
      title: 'Accompagnement personnes âgées',
      description: 'Visite et conversation avec des résidents d\'EHPAD',
      latitude: 48.8606,
      longitude: 2.3376,
      duration: 60,
      urgency: 'medium' as const,
      category: 'Social',
      organization: 'Petits Frères des Pauvres',
      created_at: new Date(),
      participants_needed: 3,
      participants_current: 1
    },
    {
      id: '3',
      title: 'Cours de français pour réfugiés',
      description: 'Aide à l\'apprentissage du français pour nouveaux arrivants',
      latitude: 48.8529,
      longitude: 2.3499,
      duration: 90,
      urgency: 'low' as const,
      category: 'Éducation',
      organization: 'France Terre d\'Asile',
      created_at: new Date(),
      participants_needed: 2,
      participants_current: 0
    },
    {
      id: '4',
      title: 'Nettoyage berges de Seine',
      description: 'Ramassage de déchets le long des berges',
      latitude: 48.8584,
      longitude: 2.3447,
      duration: 120,
      urgency: 'medium' as const,
      category: 'Environnement',
      organization: 'Surfrider Foundation',
      created_at: new Date(),
      participants_needed: 10,
      participants_current: 3
    }
  ];

  // Calcul de distance (formule haversine)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Calcul du score de matching
  const calculateMatchScore = useCallback((mission: any, distance: number): { score: number; reasons: string[] } => {
    let score = 100;
    const reasons: string[] = [];

    // Score basé sur la distance
    if (distance <= 1) {
      reasons.push('Très proche de vous (< 1km)');
    } else if (distance <= 3) {
      score -= 10;
      reasons.push('À proximité');
    } else if (distance <= 5) {
      score -= 20;
      reasons.push('Dans votre zone');
    } else {
      score -= 40;
    }

    // Score basé sur l'urgence
    if (mission.urgency === 'high') {
      score += 20;
      reasons.push('Mission urgente');
    } else if (mission.urgency === 'medium') {
      score += 10;
    }

    // Score basé sur la durée
    if (mission.duration <= 30) {
      score += 15;
      reasons.push('Mission courte (≤ 30min)');
    } else if (mission.duration <= 60) {
      score += 10;
      reasons.push('Mission rapide (≤ 1h)');
    } else if (mission.duration > preferences.maxDuration) {
      score -= 30;
    }

    // Score basé sur la catégorie préférée
    if (preferences.categories.includes(mission.category)) {
      score += 15;
      reasons.push(`Catégorie préférée: ${mission.category}`);
    }

    // Score basé sur le besoin (peu de participants)
    const participationRate = mission.participants_current / mission.participants_needed;
    if (participationRate < 0.3) {
      score += 10;
      reasons.push('Aide vraiment nécessaire');
    } else if (participationRate < 0.6) {
      score += 5;
    }

    return { score: Math.max(0, Math.min(100, score)), reasons };
  }, [preferences]);

  // Fonction de matching principal
  const performMatching = useCallback(() => {
    if (!userLocation) return;

    setMatchingResult(prev => ({ ...prev, isMatching: true }));

    // Simuler un délai de traitement
    setTimeout(() => {
      const matches: MatchedMission[] = availableMissions
        .map(mission => {
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            mission.latitude, mission.longitude
          );

          // Filtrer par distance max
          if (distance > preferences.maxDistance) return null;

          // Filtrer par durée max
          if (mission.duration > preferences.maxDuration) return null;

          // Filtrer par niveau d'urgence
          if (!preferences.urgencyLevels.includes(mission.urgency)) return null;

          const { score, reasons } = calculateMatchScore(mission, distance);

          // Calculer le temps d'arrivée estimé (vitesse moyenne 4 km/h à pied)
          const estimatedArrival = Math.round((distance / 4) * 60); // en minutes

          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            latitude: mission.latitude,
            longitude: mission.longitude,
            distance: Math.round(distance * 10) / 10,
            duration: mission.duration,
            urgency: mission.urgency,
            category: mission.category,
            organization: mission.organization,
            matchScore: score,
            matchReasons: reasons,
            estimatedArrival
          };
        })
        .filter((match): match is MatchedMission => match !== null)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchingResult({
        matches,
        totalMatches: matches.length,
        lastUpdate: new Date(),
        isMatching: false
      });
    }, 1000);
  }, [userLocation, preferences, calculateDistance, calculateMatchScore]);

  // Matching automatique en temps réel
  useEffect(() => {
    if (isRealTimeEnabled && userLocation) {
      performMatching();
      
      // Relancer le matching toutes les 30 secondes
      const interval = setInterval(performMatching, 30000);
      return () => clearInterval(interval);
    }
  }, [isRealTimeEnabled, userLocation, performMatching]);

  // Matching initial
  useEffect(() => {
    if (userLocation) {
      performMatching();
    }
  }, [userLocation, preferences, performMatching]);

  // Fonctions de contrôle
  const startRealTimeMatching = () => {
    setIsRealTimeEnabled(true);
  };

  const stopRealTimeMatching = () => {
    setIsRealTimeEnabled(false);
  };

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const refreshMatching = () => {
    performMatching();
  };

  return {
    matchingResult,
    preferences,
    isRealTimeEnabled,
    startRealTimeMatching,
    stopRealTimeMatching,
    updatePreferences,
    refreshMatching
  };
};

