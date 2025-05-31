
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserMissions } from "@/hooks/useMissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, Heart, Bell, BellOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

const AssociationsActivity = () => {
  const { user } = useAuth();
  const { data: userMissions, isLoading } = useUserMissions(user?.id);
  const [followedOrganizations, setFollowedOrganizations] = useState<string[]>([]);

  // Récupérer les organisations auxquelles l'utilisateur a participé
  const organizations = userMissions?.reduce((acc, registration) => {
    const org = registration.mission.organization;
    if (org && !acc.find(o => o.id === org.id)) {
      acc.push(org);
    }
    return acc;
  }, [] as any[]) || [];

  // Calculer les statistiques par organisation
  const getOrganizationStats = (orgId: string) => {
    const orgMissions = userMissions?.filter(r => r.mission.organization?.id === orgId) || [];
    const completedMissions = orgMissions.filter(r => r.status === 'terminé');
    const totalHours = completedMissions.reduce((acc, r) => acc + (r.mission.duration_minutes || 0) / 60, 0);
    
    return {
      totalMissions: orgMissions.length,
      completedMissions: completedMissions.length,
      totalHours: Math.round(totalHours * 10) / 10,
      upcomingMissions: orgMissions.filter(r => 
        new Date(r.mission.start_date) >= new Date() && 
        ['inscrit', 'confirmé'].includes(r.status)
      ).length
    };
  };

  const toggleFollow = (orgId: string) => {
    setFollowedOrganizations(prev => 
      prev.includes(orgId) 
        ? prev.filter(id => id !== orgId)
        : [...prev, orgId]
    );
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mes associations</h1>
        <p className="text-gray-600">
          Suivez l'activité des associations auxquelles vous participez
        </p>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune association
          </h3>
          <p className="text-gray-500 mb-6">
            Vous n'avez pas encore participé à des missions d'associations.
          </p>
          <Button asChild>
            <Link to="/missions">Découvrir des missions</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((org) => {
            const stats = getOrganizationStats(org.id);
            const isFollowed = followedOrganizations.includes(org.id);
            
            return (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={org.logo_url || ""} />
                      <AvatarFallback>
                        {org.organization_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {org.organization_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {org.description || "Description non disponible"}
                      </p>
                    </div>
                    <Button
                      variant={isFollowed ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFollow(org.id)}
                      className="shrink-0"
                    >
                      {isFollowed ? (
                        <>
                          <Bell className="w-4 h-4 mr-1" />
                          Suivi
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 mr-1" />
                          Suivre
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="stats" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="stats">Statistiques</TabsTrigger>
                      <TabsTrigger value="activity">Activité</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {stats.totalMissions}
                          </div>
                          <div className="text-xs text-gray-600">
                            Mission{stats.totalMissions > 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {stats.totalHours}h
                          </div>
                          <div className="text-xs text-gray-600">
                            Bénévolat
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Missions terminées</span>
                        <Badge variant="outline">
                          {stats.completedMissions}/{stats.totalMissions}
                        </Badge>
                      </div>
                      
                      {stats.upcomingMissions > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Missions à venir</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {stats.upcomingMissions}
                          </Badge>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-3 mt-4">
                      {userMissions
                        ?.filter(r => r.mission.organization?.id === org.id)
                        .slice(0, 3)
                        .map((registration) => (
                          <div key={registration.id} className="border-l-2 border-blue-200 pl-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {registration.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(new Date(registration.mission.start_date), 'dd MMM', { locale: fr })}
                              </span>
                            </div>
                            <p className="text-sm font-medium">
                              {registration.mission.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {registration.mission.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.round((registration.mission.duration_minutes || 0) / 60 * 10) / 10}h
                              </span>
                            </div>
                          </div>
                        ))}
                      
                      {userMissions?.filter(r => r.mission.organization?.id === org.id).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucune activité récente
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 mt-4">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/missions?organization=${org.id}`}>
                        Voir les missions
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/organization/${org.id}`}>
                        Profil complet
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssociationsActivity;
