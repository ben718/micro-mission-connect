
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { useOrganizationMissions } from "@/hooks/useMissions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MapPin, Settings, FileText } from "lucide-react";
import MissionManagement from "@/components/missions/MissionManagement";
import ReviewsManagement from "@/components/dashboard/ReviewsManagement";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentMissions from "@/components/dashboard/RecentMissions";

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
      <div className="container-custom py-6 md:py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
      <div className="container-custom py-6 md:py-10">
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
      <div className="container-custom py-6 md:py-10">
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
    <div className="container-custom py-6 md:py-10">
      {/* En-tête responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-16 w-16 lg:h-20 lg:w-20 mx-auto sm:mx-0">
            <AvatarImage src={organizationProfile.logo_url || ""} />
            <AvatarFallback className="text-xl lg:text-2xl">
              {organizationProfile.organization_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold mb-1 text-bleu">
              {organizationProfile.organization_name}
            </h1>
            <p className="text-gray-600">Dashboard de gestion</p>
            {organizationProfile.address && (
              <div className="flex items-center justify-center sm:justify-start text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-bleu flex-shrink-0" />
                <span className="text-sm truncate">{organizationProfile.address}</span>
              </div>
            )}
          </div>
        </div>
        <Button asChild className="bg-bleu hover:bg-bleu-700 text-white w-full sm:w-auto">
          <Link to="/missions/new">
            <Plus className="w-5 h-5 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      {/* Navigation par onglets responsive */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="missions" className="text-xs sm:text-sm">Missions</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm">Avis</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats stats={stats} />
          <QuickActions onTabChange={setActiveTab} />
          <RecentMissions missions={missions || []} />
        </TabsContent>

        <TabsContent value="missions">
          <MissionManagement />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagement />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <h2 className="text-xl lg:text-2xl font-bold">Paramètres de l'organisation</h2>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link to="/profile">
                      <Settings className="w-4 h-4 mr-2" />
                      Modifier le profil
                    </Link>
                  </Button>
                  <Button variant="outline" disabled className="w-full sm:w-auto">
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
