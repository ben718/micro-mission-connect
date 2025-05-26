
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { useOrganizationMissions } from "@/hooks/useMissions";
import { CalendarDays, Users, Star, TrendingUp } from "lucide-react";

const OrganizationImpact = () => {
  const { profile, user } = useAuth();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const { data: missions } = useOrganizationMissions(organizationProfile?.id);

  // Calculer les statistiques
  const stats = {
    totalMissions: missions?.length || 0,
    activeMissions: missions?.filter(m => m.status === 'active').length || 0,
    completedMissions: missions?.filter(m => m.status === 'completed').length || 0,
    totalVolunteers: missions?.reduce((acc, mission) => acc + (mission.participants_count || 0), 0) || 0,
  };

  // Missions récentes avec participants
  const recentMissions = missions?.slice(0, 5).map(mission => ({
    mission_id: mission.id,
    title: mission.title,
    status: mission.status,
    participants_count: mission.participants_count || 0,
    volunteer_rating: 0, // Mock data
    volunteer_feedback: "Excellent travail !",
    created_at: mission.created_at,
  })) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'completed': 'secondary',
      'cancelled': 'destructive',
      'draft': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  if (!profile?.is_organization || !organizationProfile) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Profil organisation non trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions actives</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions terminées</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedMissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénévoles mobilisés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Missions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMissions.length > 0 ? (
              recentMissions.map((mission) => (
                <div key={mission.mission_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{mission.title}</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(mission.status)}
                      <span className="text-sm text-muted-foreground">
                        {mission.participants_count} participant(s)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{mission.volunteer_rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {mission.created_at && new Date(mission.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">Aucune mission trouvée</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationImpact;
