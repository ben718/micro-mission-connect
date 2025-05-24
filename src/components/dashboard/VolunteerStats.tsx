import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Clock, Star } from "lucide-react";

interface VolunteerStatsProps {
  userId: string;
}

interface VolunteerStats {
  totalMissions: number;
  completedMissions: number;
  totalHours: number;
  skillsAcquired: {
    name: string;
    level: string;
  }[];
  badges: {
    name: string;
    description: string;
    image_url: string;
  }[];
  recentMissions: {
    title: string;
    organization: string;
    date: string;
    rating: number;
  }[];
}

const VolunteerStats = ({ userId }: VolunteerStatsProps) => {
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteerStats();
  }, [userId]);

  const fetchVolunteerStats = async () => {
    try {
      // Récupérer les inscriptions aux missions
      const { data: registrations } = await supabase
        .from("mission_registrations")
        .select(`
          *,
          mission:missions (
            title,
            duration_minutes,
            organization:organization_profiles (
              organization_name
            )
          )
        `)
        .eq("user_id", userId);

      // Récupérer les compétences
      const { data: skills } = await supabase
        .from("user_skills")
        .select(`
          *,
          skill:skills (
            name
          )
        `)
        .eq("user_id", userId);

      // Récupérer les badges
      const { data: badges } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badges (
            name,
            description,
            image_url
          )
        `)
        .eq("user_id", userId);

      // Calculer les statistiques
      const completedMissions = registrations?.filter((r) => r.status === "terminé").length || 0;
      const totalHours = registrations?.reduce((acc, reg) => {
        if (reg.status === "terminé" && reg.mission?.duration_minutes) {
          return acc + reg.mission.duration_minutes / 60;
        }
        return acc;
      }, 0) || 0;

      // Préparer les missions récentes
      const recentMissions = registrations
        ?.filter((r) => r.status === "terminé")
        .map((r) => ({
          title: r.mission?.title || "",
          organization: r.mission?.organization?.organization_name || "",
          date: r.created_at,
          rating: r.volunteer_rating || 0,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

      setStats({
        totalMissions: registrations?.length || 0,
        completedMissions,
        totalHours,
        skillsAcquired: skills?.map((s) => ({
          name: s.skill?.name || "",
          level: s.level || "",
        })) || [],
        badges: badges?.map((b) => ({
          name: b.badge?.name || "",
          description: b.badge?.description || "",
          image_url: b.badge?.image_url || "",
        })) || [],
        recentMissions: recentMissions || [],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques du bénévole:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMissions}</div>
            <Progress
              value={(stats.completedMissions / stats.totalMissions) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedMissions} missions terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures de bénévolat</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.totalHours)}h</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.totalHours / stats.completedMissions)}h par mission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compétences</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.skillsAcquired.length}</div>
            <p className="text-xs text-muted-foreground">
              compétences développées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.badges.length}</div>
            <p className="text-xs text-muted-foreground">
              accomplissements
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compétences acquises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.skillsAcquired.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <Badge variant="secondary">{skill.level}</Badge>
                  </div>
                  <Progress
                    value={
                      skill.level === "expert"
                        ? 100
                        : skill.level === "intermédiaire"
                        ? 66
                        : 33
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentMissions.map((mission, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mission.title}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-2 h-2 rounded-full ${
                            star <= mission.rating ? "bg-yellow-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mission.organization}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(mission.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges obtenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.badges.map((badge) => (
              <div key={badge.name} className="flex items-center gap-4">
                <img
                  src={badge.image_url}
                  alt={badge.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerStats; 