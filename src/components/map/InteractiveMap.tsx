import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { MapPin, Navigation, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';

// Types pour les missions géolocalisées
interface GeoMission {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  distance: number; // en km
  duration: number; // en minutes
  urgency: 'low' | 'medium' | 'high';
  participants_needed: number;
  participants_current: number;
  organization: string;
  category: string;
  created_at: string;
  status: 'available' | 'in_progress' | 'completed';
}

// Icônes personnalisées pour les missions
const createMissionIcon = (urgency: string, status: string) => {
  const colors = {
    low: '#10B981', // vert
    medium: '#F59E0B', // orange
    high: '#EF4444', // rouge
  };
  
  const color = colors[urgency as keyof typeof colors] || '#6B7280';
  const opacity = status === 'available' ? 1 : 0.5;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" opacity="${opacity}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Composant pour centrer la carte sur la position utilisateur
const LocationTracker: React.FC<{ userLocation: LatLng | null }> = ({ userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);
  
  return null;
};

// Composant principal de la carte interactive
const InteractiveMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [missions, setMissions] = useState<GeoMission[]>([]);
  const [selectedMission, setSelectedMission] = useState<GeoMission | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5); // km
  const watchId = useRef<number | null>(null);

  // Missions d'exemple (en attendant l'API)
  const sampleMissions: GeoMission[] = [
    {
      id: '1',
      title: 'Distribution alimentaire urgente',
      description: 'Aide pour distribuer des repas aux personnes en difficulté',
      latitude: 48.8566,
      longitude: 2.3522,
      distance: 0.8,
      duration: 45,
      urgency: 'high',
      participants_needed: 5,
      participants_current: 2,
      organization: 'Restos du Cœur',
      category: 'Aide alimentaire',
      created_at: new Date().toISOString(),
      status: 'available'
    },
    {
      id: '2',
      title: 'Accompagnement personnes âgées',
      description: 'Visite et conversation avec des résidents d\'EHPAD',
      latitude: 48.8606,
      longitude: 2.3376,
      distance: 1.2,
      duration: 60,
      urgency: 'medium',
      participants_needed: 3,
      participants_current: 1,
      organization: 'Petits Frères des Pauvres',
      category: 'Social',
      created_at: new Date().toISOString(),
      status: 'available'
    },
    {
      id: '3',
      title: 'Nettoyage parc local',
      description: 'Ramassage de déchets dans le parc du quartier',
      latitude: 48.8529,
      longitude: 2.3499,
      distance: 2.1,
      duration: 90,
      urgency: 'low',
      participants_needed: 8,
      participants_current: 4,
      organization: 'Éco-Quartier',
      category: 'Environnement',
      created_at: new Date().toISOString(),
      status: 'available'
    }
  ];

  // Géolocalisation en temps réel
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsTracking(true);
    
    // Position initiale
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = new LatLng(position.coords.latitude, position.coords.longitude);
        setUserLocation(location);
        loadNearbyMissions(location);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    // Suivi en temps réel
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = new LatLng(position.coords.latitude, position.coords.longitude);
        setUserLocation(location);
        loadNearbyMissions(location);
      },
      (error) => {
        console.error('Erreur de suivi géolocalisation:', error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
    );
  };

  const stopLocationTracking = () => {
    setIsTracking(false);
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  // Charger les missions à proximité
  const loadNearbyMissions = (location: LatLng) => {
    // Simuler le calcul de distance et filtrage
    const nearbyMissions = sampleMissions.map(mission => ({
      ...mission,
      distance: calculateDistance(
        location.lat, location.lng,
        mission.latitude, mission.longitude
      )
    })).filter(mission => mission.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);
    
    setMissions(nearbyMissions);
  };

  // Calcul de distance (formule haversine simplifiée)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10; // Arrondi à 1 décimale
  };

  // Gestion de la sélection de mission
  const handleMissionSelect = (mission: GeoMission) => {
    setSelectedMission(mission);
  };

  const handleMissionJoin = (missionId: string) => {
    // Logique pour rejoindre une mission
    console.log('Rejoindre la mission:', missionId);
    // Ici on appellerait l'API pour s'inscrire à la mission
  };

  useEffect(() => {
    // Charger les missions par défaut (Paris centre)
    const defaultLocation = new LatLng(48.8566, 2.3522);
    setUserLocation(defaultLocation);
    loadNearbyMissions(defaultLocation);
    
    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header de contrôle */}
      <div className="bg-white shadow-sm border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={isTracking ? stopLocationTracking : startLocationTracking}
              variant={isTracking ? "destructive" : "default"}
              size="sm"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isTracking ? 'Arrêter' : 'Ma position'}
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rayon:</span>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {missions.length} mission{missions.length > 1 ? 's' : ''} à proximité
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Carte */}
        <div className="flex-1 relative">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocationTracker userLocation={userLocation} />
            
            {/* Marqueur utilisateur */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={new Icon({
                  iconUrl: `data:image/svg+xml;base64,${btoa(`
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="3"/>
                      <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                  `)}`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })}
              >
                <Popup>
                  <div className="text-center">
                    <strong>Votre position</strong>
                    {isTracking && (
                      <div className="text-xs text-green-600 mt-1">
                        📍 Suivi en temps réel
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Marqueurs des missions */}
            {missions.map((mission) => (
              <Marker
                key={mission.id}
                position={[mission.latitude, mission.longitude]}
                icon={createMissionIcon(mission.urgency, mission.status)}
                eventHandlers={{
                  click: () => handleMissionSelect(mission),
                }}
              >
                <Popup>
                  <div className="w-64">
                    <h3 className="font-semibold text-sm mb-2">{mission.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{mission.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {mission.distance} km
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {mission.duration} min
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {mission.participants_current}/{mission.participants_needed}
                        </span>
                        <Badge 
                          variant={mission.urgency === 'high' ? 'destructive' : 
                                  mission.urgency === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {mission.urgency === 'high' ? 'Urgent' :
                           mission.urgency === 'medium' ? 'Modéré' : 'Flexible'}
                        </Badge>
                      </div>
                      
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleMissionJoin(mission.id)}
                      >
                        Rejoindre
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Panel latéral des missions */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Missions à proximité</h2>
            <p className="text-sm text-gray-600">
              {missions.length} mission{missions.length > 1 ? 's' : ''} dans un rayon de {searchRadius} km
            </p>
          </div>
          
          <div className="space-y-2 p-2">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMission?.id === mission.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleMissionSelect(mission)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{mission.title}</h3>
                    <Badge 
                      variant={mission.urgency === 'high' ? 'destructive' : 
                              mission.urgency === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {mission.urgency === 'high' ? 'Urgent' :
                       mission.urgency === 'medium' ? 'Modéré' : 'Flexible'}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {mission.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {mission.distance} km
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {mission.duration} min
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        {mission.participants_current}/{mission.participants_needed}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{mission.organization}</span>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMissionJoin(mission.id);
                        }}
                      >
                        Rejoindre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {missions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Aucune mission trouvée dans ce rayon</p>
              <p className="text-xs mt-1">Essayez d'augmenter le rayon de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;

