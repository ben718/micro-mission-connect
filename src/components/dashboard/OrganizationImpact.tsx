
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, CalendarDays, Users, Star, TrendingUp } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { useOrganizationMissions } from "@/hooks/useMissions";
import { useNavigate } from "react-router-dom";

const OrganizationImpact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: organizationProfile, isLoading: isLoadingOrg } = useOrganizationProfile(user?.id);
  const { data: missions, isLoading: isLoadingMissions } = useOrganizationMissions(organizationProfile?.id);

  if (isLoadingOrg || isLoadingMissions) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="mb-4">Profil organisation non trouvé</p>
        <Button onClick={() => navigate('/profile/association/edit')}>
          Créer le profil de l'organisation
        </Button>
      </div>
    );
  }

  // Calculer les statistiques à partir des vraies données
  const stats = {
    totalMissions: missions?.length || 0,
    activeMissions: missions?.filter(m => m.status === 'active').length || 0,
    completedMissions: missions?.filter(m => m.status === 'terminée').length || 0,
    totalVolunteers: missions?.reduce((acc, mission) => acc + (mission.participants_count || 0), 0) || 0,
  };

  // Missions récentes avec participants réels
  const recentMissions = missions?.slice(0, 5).map(mission => ({
    mission_id: mission.id,
    title: mission.title,
    status: mission.status,
    participants_count: mission.participants_count || 0,
    volunteer_rating: 0, // TODO: Implémenter les évaluations
    volunteer_feedback: "En attente d'évaluations",
    created_at: mission.created_at,
  })) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'terminée': 'secondary',
      'annulée': 'destructive',
      'draft': 'outline'
    } as const;
    
    const statusLabels = {
      'active': 'Active',
      'terminée': 'Terminée',
      'annulée': 'Annulée',
      'draft': 'Brouillon'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

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
          <div className="flex justify-between items-center">
            <CardTitle>Missions récentes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/missions/management')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Gérer les missions
            </Button>
          </div>
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
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune mission trouvée</p>
                <Button onClick={() => navigate('/missions/new')}>
                  Créer votre première mission
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationImpact;
