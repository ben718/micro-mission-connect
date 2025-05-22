import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

// Use simpler, flattened types to avoid recursive references
type SimpleProfile = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

type MissionParticipant = {
  id: string;
  status: string;
  user_id: string;
  profiles?: SimpleProfile;
};

// Define a simpler mission type with explicitly defined structure
type AssociationMission = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  city: string;
  status: string;
  duration_minutes?: number;
  mission_participants?: MissionParticipant[];
};

const DashboardAssociation = () => {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<AssociationMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("missions");
  const [stats, setStats] = useState({
    totalBenevoles: 0,
    totalHeures: 0,
    tauxCompletion: 0
  });

  useEffect(() => {
    if (user) {
      fetchAssociationMissions();
      fetchStats();
    }
  }, [user]);

  const fetchAssociationMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use explicit type definition with .returns() to help TypeScript understand the structure
      const { data, error } = await supabase
        .from("missions")
        .select(`
          id, 
          title, 
          description,
          starts_at,
          city,
          status,
          duration_minutes,
          mission_participants(id, status, user_id)
        `)
        .eq("association_id", user?.id)
        .order("starts_at", { ascending: true });
      
      if (error) throw error;
      
      // After fetching missions, separately fetch participant profiles to avoid deep nesting
      const missionsWithParticipants: AssociationMission[] = data || [];
      
      // Process each mission to handle participants with profiles
      for (const mission of missionsWithParticipants) {
        if (mission.mission_participants && mission.mission_participants.length > 0) {
          // Get unique user IDs from participants
          const userIds = mission.mission_participants.map(p => p.user_id);
          
          if (userIds.length > 0) {
            // Fetch profiles separately
            const { data: profilesData } = await supabase
              .from("profiles")
              .select("id, first_name, last_name, email")
              .in("id", userIds);
              
            // Map profiles to participants
            if (profilesData) {
              const profilesMap: Record<string, SimpleProfile> = {};
              profilesData.forEach(profile => {
                profilesMap[profile.id] = {
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  email: profile.email
                };
              });
              
              // Assign profiles to participants
              mission.mission_participants = mission.mission_participants.map(p => ({
                ...p,
                profiles: profilesMap[p.user_id]
              }));
            }
          }
        }
      }
      
      setMissions(missionsWithParticipants);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Nombre total de bénévoles uniques
      const { data: participants } = await supabase
        .from("mission_participants")
        .select("user_id")
        .eq("association_id", user?.id);
      const uniqueBenevoles = new Set(participants?.map(p => p.user_id)).size;
      // Heures totales
      const { data: missionsData } = await supabase
        .from("missions")
        .select("duration_minutes")
        .eq("association_id", user?.id);
      const totalMinutes = missionsData?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) || 0;
      const totalHeures = Math.round(totalMinutes / 60);
      // Taux de complétion
      const totalMissions = missions.length;
      const completedMissions = missions.filter(m => m.status === "completed").length;
      const tauxCompletion = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
      setStats({ totalBenevoles: uniqueBenevoles, totalHeures, tauxCompletion });
    } catch (err) {}
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">Ouverte</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Fermée</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{String(status)}</Badge>;
    }
  };

  const handleCandidature = async (participantId: string, status: 'confirmed' | 'refused') => {
    try {
      await supabase
        .from('mission_participants')
        .update({ status })
        .eq('id', participantId);
      fetchAssociationMissions();
      toast.success(status === 'confirmed' ? 'Candidature acceptée' : 'Candidature refusée');
    } catch (error) {
      toast.error("Une erreur est survenue lors du traitement de la candidature");
    }
  };

  if (loading) {
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
  const upcomingMissions = missions.filter((m) => new Date(m.starts_at) >= currentDate && m.status === 'open');
  const pastMissions = missions.filter((m) => new Date(m.starts_at) < currentDate || m.status !== 'open');

  return (
    <div className="container-custom py-10">
      {/* En-tête association */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="text-2xl">
              {profile?.first_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-bleu">{profile?.first_name} {profile?.last_name}</h1>
            <p className="text-gray-600">Bienvenue sur votre espace association !</p>
            {profile?.location && (
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-bleu" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
        <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3 shadow-sm">
          <Link to="/missions/new">
            <Plus className="w-5 h-5 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions créées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{missions.length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Bénévoles mobilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalBenevoles}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Heures bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalHeures}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart2 className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.tauxCompletion}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bleu">
              <Plus className="w-5 h-5 text-bleu" />
              Créer une mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Publiez de nouvelles missions pour mobiliser des bénévoles.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/missions/new">Créer une mission</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bleu">
              <Users className="w-5 h-5 text-bleu" />
              Voir les inscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Consultez la liste des bénévoles inscrits à vos missions.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/inscriptions">Voir les inscriptions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bleu">
              <BarChart2 className="w-5 h-5 text-bleu" />
              Statistiques détaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Analysez l'impact de votre association grâce à des statistiques détaillées.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/statistiques">Voir les statistiques</Link>
            </Button>
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
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.starts_at)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.city}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{mission.description}</p>
                        {mission.mission_participants && mission.mission_participants.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2 text-sm text-gray-700">Candidatures en attente</h4>
                            <div className="space-y-2">
                              {mission.mission_participants.filter((p) => p.status === 'pending').length === 0 && (
                                <span className="text-gray-400 text-sm">Aucune candidature en attente</span>
                              )}
                              {mission.mission_participants.filter((p) => p.status === 'pending').map((p) => (
                                <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{p.profiles?.first_name?.[0] || '?'}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{p.profiles?.first_name} {p.profiles?.last_name}</span>
                                    <span className="text-xs text-gray-500">{p.profiles?.email}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleCandidature(p.id, 'confirmed')}>Accepter</Button>
                                    <Button size="sm" variant="outline" className="border-red-400 text-red-600 hover:bg-red-50" onClick={() => handleCandidature(p.id, 'refused')}>Refuser</Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.mission_participants?.length || 0}</span>
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
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.starts_at)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.city}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{mission.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.mission_participants?.length || 0}</span>
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
