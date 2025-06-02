import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useMissions, Mission } from '@/hooks/useMissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composant de carte simplifiée
const SimpleMap: React.FC<{
  missions: Mission[];
  userLocation: { lat: number; lng: number } | null;
  onMissionSelect: (mission: Mission) => void;
}> = ({ missions, userLocation, onMissionSelect }) => {
  return (
    <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
      {/* Simulation d'une carte avec des points */}
      <div className="absolute inset-0 bg-gray-200 opacity-50"></div>
      
      {/* Points de missions */}
      {missions.slice(0, 6).map((mission, index) => (
        <div
          key={mission.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${30 + index * 15}%`,
            top: `${40 + index * 10}%`
          }}
          onClick={() => onMissionSelect(mission)}
        >
          <div className={`text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${
            mission.urgency === 'high' ? 'bg-red-500' : 
            mission.urgency === 'medium' ? 'bg-orange-500' : 'bg-green-500'
          }`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-32 text-xs">
            <p className="font-medium">{mission.title}</p>
            <p className="text-gray-600">{mission.organization?.name}</p>
          </div>
        </div>
      ))}
      
      {/* Position utilisateur */}
      {userLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded px-2 py-1 text-xs">
            Vous
          </div>
        </div>
      )}
      
      {/* Overlay d'information */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <p className="text-sm font-medium">Carte interactive des missions</p>
        <p className="text-xs text-gray-600">Cliquez sur les points pour voir les détails</p>
      </div>
    </div>
  );
};

const MapPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  
  const { missions, loading, error, joinMission } = useMissions();

  // Demander la géolocalisation
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocationEnabled(true);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          // Position par défaut (Paris)
          setUserLocation({ lat: 48.8566, lng: 2.3522 });
          setIsLocationEnabled(true);
        }
      );
    } else {
      // Position par défaut si géolocalisation non supportée
      setUserLocation({ lat: 48.8566, lng: 2.3522 });
      setIsLocationEnabled(true);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const filteredMissions = missions.filter(mission =>
    mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.organization?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinMission = async (missionId: string) => {
    const success = await joinMission(missionId);
    if (success) {
      alert('Inscription réussie !');
    } else {
      alert('Erreur lors de l\'inscription');
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Modéré';
      case 'low': return 'Flexible';
      default: return 'Normal';
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Carte des missions
        </h1>
        <p className="text-gray-600">
          Trouvez des missions de bénévolat près de chez vous
        </p>
      </div>

      {/* Contrôles */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par titre, catégorie ou organisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={requestLocation}
            className="flex items-center space-x-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Ma position</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Missions à proximité</span>
                {isLocationEnabled && (
                  <Badge variant="secondary" className="ml-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Géolocalisation active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleMap
                missions={filteredMissions}
                userLocation={userLocation}
                onMissionSelect={setSelectedMission}
              />
            </CardContent>
          </Card>
        </div>

        {/* Liste des missions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            Missions disponibles ({filteredMissions.length})
          </h3>
          
          {filteredMissions.map((mission) => (
            <Card
              key={mission.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMission?.id === mission.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedMission(mission)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{mission.title}</h4>
                  <Badge
                    variant={mission.urgency === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {getUrgencyLabel(mission.urgency)}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{mission.organization?.name}</p>
                <p className="text-xs text-gray-700 mb-3 line-clamp-2">{mission.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {mission.location}
                  </span>
                  <span>{calculateDuration(mission.start_time, mission.end_time)} min</span>
                  <span>{mission.participants_current}/{mission.participants_needed}</span>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinMission(mission.id);
                  }}
                >
                  Rejoindre cette mission
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission sélectionnée */}
      {selectedMission && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">{selectedMission.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">{selectedMission.description}</p>
                <p className="text-sm font-medium text-gray-900">{selectedMission.organization?.name}</p>
                <p className="text-xs text-gray-600">{selectedMission.location}</p>
                <Badge className="mt-2">{selectedMission.category}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Date:</span>
                  <span>{format(new Date(selectedMission.date), 'dd MMMM yyyy', { locale: fr })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Horaires:</span>
                  <span>{selectedMission.start_time} - {selectedMission.end_time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Durée:</span>
                  <span>{calculateDuration(selectedMission.start_time, selectedMission.end_time)} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Participants:</span>
                  <span>{selectedMission.participants_current}/{selectedMission.participants_needed}</span>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleJoinMission(selectedMission.id)}
                >
                  Rejoindre cette mission
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapPage;

