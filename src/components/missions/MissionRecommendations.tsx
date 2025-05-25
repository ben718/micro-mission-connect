
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Mission } from "@/types/mission";

const MissionRecommendations = () => {
  const { user, profile } = useAuth();
  const [recommendations, setRecommendations] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !profile) return;

      try {
        // Récupérer les compétences de l'utilisateur
        const { data: userSkills } = await supabase
          .from("user_skills")
          .select("skill_id")
          .eq("user_id", user.id);

        if (!userSkills) return;

        const skillIds = userSkills.map((us) => us.skill_id);

        // Récupérer les missions qui correspondent aux compétences
        const { data: missions, error } = await supabase
          .from("missions")
          .select(`
            *,
            organization_profiles!inner (
              organization_name,
              logo_url
            ),
            mission_skills (
              skill:skills (name)
            )
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        // Transformer les données pour correspondre au type Mission
        const transformedMissions: Mission[] = (missions || []).map(mission => ({
          ...mission,
          required_skills: mission.mission_skills?.map((ms: any) => ms.skill?.name).filter(Boolean) || [],
          organization: {
            id: mission.organization_id,
            organization_name: mission.organization_profiles?.organization_name || '',
            logo_url: mission.organization_profiles?.logo_url || '',
            user_id: mission.organization_id,
            created_at: '',
            updated_at: '',
            description: null,
            website_url: null,
            siret_number: null,
            address: null,
            creation_date: null,
            sector_id: null,
            location: null,
            longitude: null,
            latitude: null
          },
          participants_count: 0
        }));

        setRecommendations(transformedMissions);
      } catch (error) {
        console.error("Erreur lors de la récupération des recommandations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Aucune mission recommandée pour le moment. Complétez votre profil avec vos compétences pour recevoir des recommandations personnalisées.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
      : `${remainingMinutes}min`;
  };

  return (
    <div className="space-y-4">
      {recommendations.map((mission) => (
        <Card key={mission.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{mission.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src={mission.organization.logo_url || "/placeholder.svg"}
                    alt={mission.organization.organization_name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>{mission.organization.organization_name}</span>
                </div>
              </div>
              <Badge variant="outline">{mission.format}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mission.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{mission.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDuration(mission.duration_minutes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Niveau {mission.difficulty_level}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {mission.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <Button asChild className="w-full">
                <Link to={`/missions/${mission.id}`}>
                  Voir la mission
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MissionRecommendations;
