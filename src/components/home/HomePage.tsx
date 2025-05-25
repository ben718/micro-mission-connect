import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search, MapPin, Clock, Users, Target } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { Mission } from "@/types/mission";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [popularMissions, setPopularMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { coordinates, error: locationError } = useGeolocation();

  useEffect(() => {
    fetchMissions();
    fetchPopularMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("available_missions_details")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      
      // Transformer les données pour correspondre au type Mission
      const transformedMissions = data?.map(item => ({
        ...item,
        id: item.mission_id,
        organization: {
          organization_name: item.organization_name,
          logo_url: item.logo_url
        },
        required_skills: item.required_skills || []
      })) as Mission[];
      
      setMissions(transformedMissions || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularMissions = async () => {
    try {
      // Utiliser la vue popular_skills pour trouver les missions les plus demandées
      const { data: popularSkills } = await supabase
        .from("popular_skills")
        .select("name")
        .limit(3);

      if (popularSkills) {
        const { data } = await supabase
          .from("available_missions_details")
          .select("*")
          .contains("required_skills", popularSkills.map(s => s.name))
          .limit(6);
          
        // Transformer les données pour correspondre au type Mission
        const transformedMissions = data?.map(item => ({
          ...item,
          id: item.mission_id,
          organization: {
            organization_name: item.organization_name,
            logo_url: item.logo_url
          },
          required_skills: item.required_skills || []
        })) as Mission[];
        
        setPopularMissions(transformedMissions || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des missions populaires:", error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ""}`;
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "Présentiel":
        return "bg-blue-100 text-blue-800";
      case "À distance":
        return "bg-green-100 text-green-800";
      case "Hybride":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Barre de recherche avancée */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedFormat(null)}>
              {selectedFormat || "Format"}
            </Button>
            <Button variant="outline" onClick={() => setSelectedDifficulty(null)}>
              {selectedDifficulty || "Difficulté"}
            </Button>
            <Button variant="outline" onClick={() => setSelectedEngagement(null)}>
              {selectedEngagement || "Engagement"}
            </Button>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      {/* Carte interactive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Missions à proximité</h2>
          <div className="h-[400px]">
            <MapContainer
              center={coordinates || [48.8566, 2.3522]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {missions.map((mission) => (
                <Marker
                  key={mission.id}
                  position={[mission.latitude, mission.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{mission.title}</h3>
                      <p className="text-sm">{mission.organization.organization_name}</p>
                      <Badge className={getFormatColor(mission.format)}>
                        {mission.format}
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Missions populaires */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Missions populaires</h2>
          <div className="space-y-4">
            {popularMissions.map((mission) => (
              <Card key={mission.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{mission.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-2">
                    <Badge className={getFormatColor(mission.format)}>
                      {mission.format}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {mission.difficulty_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(mission.duration_minutes)}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {mission.available_spots} places
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {mission.location}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{mission.desired_impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des missions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Toutes les missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions.map((mission) => (
            <Card key={mission.id}>
              <CardHeader>
                <CardTitle className="text-lg">{mission.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-2">
                  <Badge className={getFormatColor(mission.format)}>
                    {mission.format}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {mission.difficulty_level}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(mission.duration_minutes)}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {mission.available_spots} places
                  </div>
                </div>
                <p className="mt-2 text-sm">{mission.desired_impact}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mission.required_skills?.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
