import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Navigation, 
  CheckCircle, 
  XCircle,
  Play,
  Pause,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useMissionTracking } from '@/hooks/useMissionTracking';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'leaflet/dist/leaflet.css';

// Composant pour le statut de la mission
const MissionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: 'bg-yellow-500', icon: Clock };
      case 'accepted':
        return { label: 'Acceptée', color: 'bg-blue-500', icon: CheckCircle };
      case 'on_way':
        return { label: 'En route', color: 'bg-orange-500', icon: Navigation };
      case 'arrived':
        return { label: 'Arrivé', color: 'bg-purple-500', icon: MapPin };
      case 'in_progress':
        return { label: 'En cours', color: 'bg-green-500', icon: Play };
      case 'completed':
        return { label: 'Terminée', color: 'bg-green-600', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Annulée', color: 'bg-red-500', icon: XCircle };
      default:
        return { label: 'Inconnu', color: 'bg-gray-500', icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.color} text-white flex items-center space-x-1`}>
      <IconComponent className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

// Composant pour la timeline de la mission
const MissionTimeline: React.FC<{ timeline: any[] }> = ({ timeline }) => {
  return (
    <div className="space-y-3">
      {timeline.map((entry, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className={`w-3 h-3 rounded-full mt-1 ${
            index === 0 ? 'bg-blue-500' : 'bg-gray-300'
          }`}></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{entry.message}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(entry.timestamp, { addSuffix: true, locale: fr })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant principal de tracking de mission
const MissionTracker: React.FC<{ missionId: string }> = ({ missionId }) => {
  const {
    currentMission,
    isTracking,
    userLocation,
    updateMissionStatus,
    leaveMission,
    calculateDistance
  } = useMissionTracking(missionId);

  const [showFullMap, setShowFullMap] = useState(false);

  if (!currentMission) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Mission non trouvée</p>
      </div>
    );
  }

  const { mission, status, volunteer, timeline } = currentMission;

  // Calculer la distance restante
  const distanceToMission = userLocation 
    ? calculateDistance(
        userLocation.lat, userLocation.lng,
        mission.latitude, mission.longitude
      )
    : null;

  // Calculer le pourcentage de progression
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'accepted': return 20;
      case 'on_way': return 40;
      case 'arrived': return 60;
      case 'in_progress': return 80;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  // Actions disponibles selon le statut
  const getAvailableActions = (status: string) => {
    switch (status) {
      case 'accepted':
        return [
          { label: 'Commencer le trajet', action: () => updateMissionStatus(missionId, 'on_way'), primary: true },
          { label: 'Annuler', action: () => leaveMission(missionId), primary: false }
        ];
      case 'on_way':
        return [
          { label: 'Je suis arrivé', action: () => updateMissionStatus(missionId, 'arrived'), primary: true },
          { label: 'Annuler', action: () => leaveMission(missionId), primary: false }
        ];
      case 'arrived':
        return [
          { label: 'Commencer la mission', action: () => updateMissionStatus(missionId, 'in_progress'), primary: true }
        ];
      case 'in_progress':
        return [
          { label: 'Terminer la mission', action: () => updateMissionStatus(missionId, 'completed'), primary: true }
        ];
      default:
        return [];
    }
  };

  const actions = getAvailableActions(status.status);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header avec statut */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <MissionStatusBadge status={status.status} />
          <div className="flex items-center space-x-2">
            {isTracking && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
            <span className="text-xs">Suivi actif</span>
          </div>
        </div>
        <h1 className="text-lg font-bold">{mission.title}</h1>
        <p className="text-sm opacity-90">{mission.organization}</p>
      </div>

      {/* Barre de progression */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Progression</span>
          <span>{getProgressPercentage(status.status)}%</span>
        </div>
        <Progress value={getProgressPercentage(status.status)} className="h-2" />
      </div>

      {/* Informations de localisation */}
      {userLocation && distanceToMission !== null && (
        <Card className="m-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Distance restante</p>
                  <p className="text-xs text-gray-500">{mission.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {distanceToMission < 1 
                    ? `${Math.round(distanceToMission * 1000)}m`
                    : `${distanceToMission.toFixed(1)}km`
                  }
                </p>
                <p className="text-xs text-gray-500">
                  ~{Math.round(distanceToMission * 15)} min à pied
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carte miniature */}
      <div className="m-4">
        <div 
          className="h-48 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setShowFullMap(true)}
        >
          <MapContainer
            center={[mission.latitude, mission.longitude]}
            zoom={15}
            className="h-full w-full"
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            
            {/* Marqueur de la mission */}
            <Marker
              position={[mission.latitude, mission.longitude]}
              icon={new Icon({
                iconUrl: `data:image/svg+xml;base64,${btoa(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                  </svg>
                `)}`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })}
            >
              <Popup>{mission.title}</Popup>
            </Marker>

            {/* Marqueur de l'utilisateur */}
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
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
                <Popup>Votre position</Popup>
              </Marker>
            )}

            {/* Ligne de trajet */}
            {userLocation && (
              <Polyline
                positions={[
                  [userLocation.lat, userLocation.lng],
                  [mission.latitude, mission.longitude]
                ]}
                color="#3B82F6"
                weight={3}
                opacity={0.7}
                dashArray="5, 10"
              />
            )}
          </MapContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Touchez pour voir la carte complète
        </p>
      </div>

      {/* Informations de contact */}
      {mission.contact_person && (
        <Card className="m-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{mission.contact_person}</p>
                <p className="text-sm text-gray-600">{mission.organization}</p>
              </div>
              <div className="flex space-x-2">
                {mission.contact_phone && (
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="m-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Historique</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <MissionTimeline timeline={timeline} />
        </CardContent>
      </Card>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="p-4 bg-white border-t sticky bottom-0">
          <div className="space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`w-full ${action.primary ? '' : 'variant-outline'}`}
                variant={action.primary ? 'default' : 'outline'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message de fin */}
      {status.status === 'completed' && (
        <div className="p-4 bg-green-50 border-t">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Mission terminée !</h3>
            <p className="text-sm text-green-600 mt-1">
              Merci pour votre engagement. Votre aide a fait la différence.
            </p>
            {status.actual_duration && (
              <p className="text-xs text-green-500 mt-2">
                Durée: {status.actual_duration} minutes
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionTracker;

