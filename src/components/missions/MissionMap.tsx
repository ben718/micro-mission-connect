import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correction pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  duration_minutes: number;
  format: string;
  difficulty_level: string;
  engagement_level: string;
  required_skills: string[];
  organization: {
    name: string;
    profile_picture_url: string;
  };
}

interface MissionMapProps {
  missions: Mission[];
  userLocation?: {
    lat: number;
    lng: number;
  };
}

const MissionMap = ({ missions, userLocation }: MissionMapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
      : `${remainingMinutes}min`;
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Missions à proximité</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>Votre position</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {missions.map((mission) => (
            <Marker
              key={mission.id}
              position={[mission.coordinates.lat, mission.coordinates.lng]}
            >
              <Popup>
                <div className="space-y-2 min-w-[200px]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{mission.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {mission.organization.name}
                      </p>
                    </div>
                    <Badge variant="outline">{mission.format}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDuration(mission.duration_minutes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Niveau {mission.difficulty_level}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {mission.required_skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mission.required_skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{mission.required_skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button asChild size="sm" className="w-full">
                    <Link to={`/missions/${mission.id}`}>
                      Voir la mission
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default MissionMap; 