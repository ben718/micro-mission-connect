import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { useOrganizationMissions } from "@/hooks/useMissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, Users, Clock, Calendar, MapPin, BarChart2, 
  Building2, Target, Award, Heart, Star, TrendingUp, AlertCircle,
  MessageSquare, Settings, FileText
} from "lucide-react";
import MissionManagement from "@/components/missions/MissionManagement";
import ReviewsManagement from "@/components/dashboard/ReviewsManagement";

const DashboardAssociation = () => {
  const { user, profile } = useAuth();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const { data: missions, isLoading, error } = useOrganizationMissions(organizationProfile?.id);
  const [activeTab, setActiveTab] = useState("overview");

  // Calcul des statistiques en temps réel
  const stats = React.useMemo(() => {
    if (!missions) return {
      totalMissions: 0,
      activeMissions: 0,
      completedMissions: 0,
      totalVolunteers: 0,
      upcomingMissions: 0,
      totalHours: 0
    };

    const now = new Date();
    const activeMissions = missions.filter(m => m.status === 'active');
    const completedMissions = missions.filter(m => m.status === 'terminée');
    const upcomingMissions = missions.filter(m => 
      new Date(m.start_date) > now && m.status === 'active'
    );
    
    // Correction : utiliser les participants déjà comptés dans participants_count
    const totalVolunteers = missions.reduce((sum, m) => 
      sum + (m.participants_count || 0), 0
    );

    const totalHours = missions.reduce((sum, m) => 
      sum + (m.duration_minutes || 0), 0
    ) / 60;

    return {
      totalMissions: missions.length,
      activeMissions: activeMissions.length,
      completedMissions: completedMissions.length,
      totalVolunteers,
      upcomingMissions: upcomingMissions.length,
      totalHours: Math.round(totalHours)
    };
  }, [missions]);

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Erreur lors du chargement du dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Profil d'organisation requis</h2>
            <p className="text-gray-500 mb-4">Vous devez compléter votre profil d'organisation pour accéder au dashboard.</p>
            <Button asChild>
              <Link to="/profile">Compléter mon profil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      {/* En-tête de l'association */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={organizationProfile.logo_url || ""} />
            <AvatarFallback className="text-2xl">
              {organizationProfile.organization_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-bleu">
              {organizationProfile.organization_name}
            </h1>
            <p className="text-gray-600">Dashboard de gestion</p>
            {organizationProfile.address && (
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-bleu" />
                <span className="text-sm">{organizationProfile.address}</span>
              </div>
            )}
          </div>
        </div>
        <Button asChild className="bg-bleu hover:bg-bleu-700 text-white">
          <Link to="/missions/new">
            <Plus className="w-5 h-5 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMissions}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeMissions} actives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bénévoles engagés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
                <p className="text-xs text-muted-foreground">
                  Toutes missions confondues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Heures de bénévolat</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalHours}h</div>
                <p className="text-xs text-muted-foreground">
                  Temps total planifié
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missions à venir</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingMissions}</div>
                <p className="text-xs text-muted-foreground">
                  Prochainement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missions terminées</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedMissions}</div>
                <p className="text-xs text-muted-foreground">
                  Terminées avec succès
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalMissions > 0 
                    ? Math.round((stats.completedMissions / stats.totalMissions) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Missions réussies
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
                  <Link to="/missions/new">
                    <Plus className="w-6 h-6" />
                    <span>Créer une mission</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setActiveTab("missions")}
                >
                  <BarChart2 className="w-6 h-6" />
                  <span>Gérer les missions</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setActiveTab("reviews")}
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>Voir les avis</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Missions récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Missions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {missions && missions.length > 0 ? (
                <div className="space-y-4">
                  {missions.slice(0, 3).map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(mission.start_date).toLocaleDateString('fr-FR')} • {mission.participants_count || 0} participants
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/missions/${mission.id}`}>Voir</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucune mission créée</p>
                  <Button asChild>
                    <Link to="/missions/new">Créer votre première mission</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missions">
          <MissionManagement />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagement />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paramètres de l'organisation</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button asChild variant="outline">
                    <Link to="/profile">
                      <Settings className="w-4 h-4 mr-2" />
                      Modifier le profil
                    </Link>
                  </Button>
                  <Button variant="outline" disabled>
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter les données (Bientôt disponible)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAssociation;
