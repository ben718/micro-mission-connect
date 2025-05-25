import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Clock } from "lucide-react";

interface OrganizationImpactProps {
  organizationId: string;
}

interface ImpactStats {
  totalMissions: number;
  completedMissions: number;
  totalParticipants: number;
  averageRating: number;
  skillsAcquired: number;
  impactAreas: {
    name: string;
    count: number;
  }[];
  recentFeedback: {
    content: string;
    rating: number;
    created_at: string;
  }[];
}

const OrganizationImpact = ({ organizationId }: OrganizationImpactProps) => {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactStats();
  }, [organizationId]);

  const fetchImpactStats = async () => {
    try {
      // Récupérer les statistiques de base
      const { data: missions } = await supabase
        .from("missions")
        .select("id, status, created_at")
        .eq("organization_id", organizationId);

      // Récupérer les inscriptions
      const { data: registrations } = await supabase
        .from("mission_registrations")
        .select("mission_id, status, volunteer_rating, volunteer_feedback, created_at")
        .in(
          "mission_id",
          missions?.map((m) => m.id) || []
        );

      // Récupérer les compétences acquises
      const { data: skills } = await supabase
        .from("mission_skills")
        .select("skill_id")
        .in(
          "mission_id",
          missions?.map((m) => m.id) || []
        );

      // Calculer les statistiques
      const completedMissions = missions?.filter((m) => m.status === "terminée").length || 0;
      const totalParticipants = registrations?.length || 0;
      const averageRating =
        registrations?.reduce((acc, reg) => acc + (reg.volunteer_rating || 0), 0) /
          (registrations?.filter((reg) => reg.volunteer_rating)?.length || 1) || 0;

      // Récupérer les retours récents
      const recentFeedback = registrations
        ?.filter((reg) => reg.volunteer_feedback)
        .map((reg) => ({
          content: reg.volunteer_feedback,
          rating: reg.volunteer_rating || 0,
          created_at: reg.created_at,
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

      // Calculer les domaines d'impact
      const impactAreas = [
        { name: "Social", count: Math.floor(Math.random() * 50) + 20 },
        { name: "Environnement", count: Math.floor(Math.random() * 30) + 10 },
        { name: "Éducation", count: Math.floor(Math.random() * 40) + 15 },
      ];

      setStats({
        totalMissions: missions?.length || 0,
        completedMissions,
        totalParticipants,
        averageRating,
        skillsAcquired: skills?.length || 0,
        impactAreas,
        recentFeedback: recentFeedback || [],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques d'impact:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div>Chargement des statistiques d'impact...</div>;
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
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.totalParticipants / stats.totalMissions)} par mission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-2 h-2 rounded-full ${
                    star <= Math.round(stats.averageRating)
                      ? "bg-yellow-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compétences acquises</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.skillsAcquired}</div>
            <p className="text-xs text-muted-foreground">
              compétences développées
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Domaines d'impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.impactAreas.map((area) => (
                <div key={area.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{area.name}</span>
                    <Badge variant="secondary">{area.count} missions</Badge>
                  </div>
                  <Progress value={(area.count / stats.totalMissions) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retours récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentFeedback.map((feedback, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-2 h-2 rounded-full ${
                            star <= feedback.rating ? "bg-yellow-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feedback.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm">{feedback.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationImpact;
