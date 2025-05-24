
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Clock, Calendar, MapPin, BarChart2 } from "lucide-react";
import { toast } from 'sonner';

// Types simplifiés pour éviter les références circulaires
type SimpleProfile = {
  id: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
};

type MissionRegistration = {
  id: string;
  status: string;
  user_id: string;
  profiles?: SimpleProfile;
};

type SimpleMission = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  location: string;
  status: string;
  duration_minutes?: number;
  registrations?: MissionRegistration[];
};

interface Stats {
  totalBenevoles: number;
  totalHeures: number;
  tauxCompletion: number;
}

const DashboardAssociation = () => {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<SimpleMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("missions");
  const [stats, setStats] = useState<Stats>({
    totalBenevoles: 0,
    totalHeures: 0,
    tauxCompletion: 0
  });

  useEffect(() => {
    if (user) {
      fetchOrganizationMissions();
      fetchStats();
    }
  }, [user]);

  const fetchOrganizationMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // D'abord récupérer l'ID de l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from("organization_profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (orgError) throw orgError;

      // Récupérer les missions de l'organisation
      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select(`
          id, 
          title, 
          description,
          start_date,
          location,
          status,
          duration_minutes
        `)
        .eq("organization_id", orgData.id)
        .order("start_date", { ascending: true });
      
      if (missionsError) throw missionsError;
      
      let missionsWithRegistrations: SimpleMission[] = missionsData || [];
      
      // Pour chaque mission, récupérer ses inscriptions avec les profils
      for (const mission of missionsWithRegistrations) {
        const { data: registrationsData, error: registrationsError } = await supabase
          .from("mission_registrations")
          .select(`
            id, 
            status, 
            user_id
          `)
          .eq("mission_id", mission.id);
          
        if (registrationsError) {
          console.error("Erreur lors de la récupération des inscriptions:", registrationsError);
          continue;
        }
        
        // Pour chaque inscription, récupérer le profil
        const registrationsWithProfiles = [];
        for (const reg of registrationsData || []) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, profile_picture_url")
            .eq("id", reg.user_id)
            .single();
            
          registrationsWithProfiles.push({
            id: reg.id,
            status: reg.status,
            user_id: reg.user_id,
            profiles: profileData ? {
              id: profileData.id,
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              profile_picture_url: profileData.profile_picture_url
            } : undefined
          });
        }
        
        mission.registrations = registrationsWithProfiles;
      }
      
      setMissions(missionsWithRegistrations);
    } catch (err: any) {
      console.error("Erreur lors du chargement des missions:", err);
      setError(err.message || "Une erreur est survenue lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (!user) {
        console.error("Aucun utilisateur connecté pour récupérer les statistiques");
        return;
      }

      // Récupérer l'ID de l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from("organization_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (orgError) {
        console.error("Erreur lors de la récupération de l'organisation:", orgError);
        return;
      }

      // Nombre total de bénévoles uniques
      const { data: registrations, error: registrationsError } = await supabase
        .from("mission_registrations")
        .select("user_id, missions!inner(organization_id)")
        .eq("missions.organization_id", orgData.id);
      
      if (registrationsError) {
        console.error("Erreur lors de la récupération des inscriptions:", registrationsError);
        return;
      }

      const uniqueBenevoles = new Set(registrations?.map(r => r.user_id) || []).size;
      
      // Heures totales
      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select("duration_minutes")
        .eq("organization_id", orgData.id);

      if (missionsError) {
        console.error("Erreur lors de la récupération des missions pour les statistiques:", missionsError);
        return;
      }

      const totalMinutes = missionsData?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) || 0;
      const totalHeures = Math.round(totalMinutes / 60);
      
      // Taux de complétion
      const totalMissions = missions.length;
      const completedMissions = missions.filter(m => m.status === "completed").length;
      const tauxCompletion = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
      
      setStats({ totalBenevoles: uniqueBenevoles, totalHeures, tauxCompletion });
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{String(status)}</Badge>;
    }
  };

  const handleRegistrationAction = async (registrationId: string, action: 'accept' | 'reject') => {
    try {
      const newStatus = action === 'accept' ? 'confirmé' : 'annulé';
      
      const { error } = await supabase
        .from('mission_registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;
      
      fetchOrganizationMissions(); // Rafraîchir les données
      toast.success(action === 'accept' ? 'Inscription acceptée' : 'Inscription refusée');
    } catch (error) {
      console.error("Erreur lors du traitement de l'inscription:", error);
      toast.error("Une erreur est survenue lors du traitement de l'inscription");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
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
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button asChild>
              <Link to="/missions">Voir toutes les missions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDate = new Date();
  const upcomingMissions = missions.filter((m) => new Date(m.start_date) >= currentDate && m.status === 'active');
  const pastMissions = missions.filter((m) => new Date(m.start_date) < currentDate || m.status !== 'active');

  return (
    <div className="container mx-auto py-10">
      {/* En-tête organisation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-blue-600">{user?.email}</h1>
            <p className="text-gray-600">Bienvenue sur votre espace association !</p>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1 text-blue-600" />
              <span>{profile?.city || "Non renseigné"}</span>
            </div>
          </div>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 shadow-sm">
          <Link to="/missions/create">
            <Plus className="w-5 h-5 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions créées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-600">{missions.length}</span>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-base font-semibold text-gray-500">Bénévoles mobilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-600">{stats.totalBenevoles}</span>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-base font-semibold text-gray-500">Heures bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-600">{stats.totalHeures}</span>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart2 className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-base font-semibold text-gray-500">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-blue-600">{stats.tauxCompletion}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Missions */}
      <Card className="border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b rounded-none">
              <TabsTrigger value="missions" className="flex-1">Missions à venir ({upcomingMissions.length})</TabsTrigger>
              <TabsTrigger value="past-missions" className="flex-1">Missions passées ({pastMissions.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="missions" className="p-6">
              <h2 className="text-xl font-bold mb-4">Missions à venir</h2>
              {upcomingMissions.length === 0 ? (
                <p className="text-gray-500">Aucune mission à venir.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingMissions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-blue-600 hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.start_date)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{mission.description}</p>
                        
                        {mission.registrations && mission.registrations.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2 text-sm text-gray-700">Inscriptions en attente</h4>
                            <div className="space-y-2">
                              {mission.registrations.filter((r) => r.status === 'inscrit').length === 0 && (
                                <span className="text-gray-400 text-sm">Aucune inscription en attente</span>
                              )}
                              {mission.registrations.filter((r) => r.status === 'inscrit').map((registration) => (
                                <div key={registration.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={registration.profiles?.profile_picture_url} />
                                      <AvatarFallback>{registration.profiles?.first_name?.[0] || '?'}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">
                                      {registration.profiles?.first_name} {registration.profiles?.last_name}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700 text-white" 
                                      onClick={() => handleRegistrationAction(registration.id, 'accept')}
                                    >
                                      Accepter
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-red-400 text-red-600 hover:bg-red-50" 
                                      onClick={() => handleRegistrationAction(registration.id, 'reject')}
                                    >
                                      Refuser
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.registrations?.length || 0}</span>
                          </div>
                          {getStatusBadge(mission.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past-missions" className="p-6">
              <h2 className="text-xl font-bold mb-4">Missions passées</h2>
              {pastMissions.length === 0 ? (
                <p className="text-gray-500">Aucune mission passée.</p>
              ) : (
                <div className="space-y-4">
                  {pastMissions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-blue-600 hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.start_date)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{mission.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.registrations?.length || 0}</span>
                          </div>
                          {getStatusBadge(mission.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAssociation;
