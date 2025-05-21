import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Users, Clock, BarChart2, Plus, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const AssociationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [association, setAssociation] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [stats, setStats] = useState({
    totalBenevoles: 0,
    totalHeures: 0,
    tauxCompletion: 0
  });

  useEffect(() => {
    if (id) {
      fetchAssociationAndMissions();
    }
  }, [id]);

  const fetchAssociationAndMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Profil association
      const { data: associationData, error: associationError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .eq("is_association", true)
        .single();
      if (associationError) throw new Error("Association introuvable");
      setAssociation(associationData);
      // Missions créées
      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select("*, mission_participants(id, user_id)")
        .eq("association_id", id)
        .order("starts_at", { ascending: true });
      if (missionsError) throw missionsError;
      setMissions(missionsData || []);
      // Stats
      const totalBenevoles = new Set((missionsData || []).flatMap(m => m.mission_participants?.map(p => p.user_id))).size;
      const totalMinutes = (missionsData || []).reduce((acc, m) => acc + (m.duration_minutes || 0), 0);
      const totalHeures = Math.round(totalMinutes / 60);
      const totalMissions = missionsData.length;
      const completedMissions = missionsData.filter(m => m.status === "completed").length;
      const tauxCompletion = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
      setStats({ totalBenevoles, totalHeures, tauxCompletion });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
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

  if (error || !association) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Association introuvable</h2>
            <p className="text-gray-500 mb-4">{error || "L'association que vous recherchez n'existe pas."}</p>
            <Button asChild>
              <a href="/missions">Voir toutes les missions</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Séparer missions à venir et passées
  const currentDate = new Date();
  const upcomingMissions = missions.filter((m) => new Date(m.starts_at) >= currentDate && m.status === 'open');
  const pastMissions = missions.filter((m) => new Date(m.starts_at) < currentDate || m.status !== 'open');

  return (
    <div className="container-custom py-10">
      {/* En-tête association */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={association.avatar_url || ""} />
            <AvatarFallback className="text-2xl">
              {association.first_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1">{association.first_name} {association.last_name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Association vérifiée</Badge>
              {association.website && (
                <a href={association.website} target="_blank" rel="noopener noreferrer" className="text-bleu flex items-center gap-1 ml-2 text-sm hover:underline"><LinkIcon className="w-4 h-4" />Site web</a>
              )}
            </div>
            {association.location && (
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{association.location}</span>
              </div>
            )}
            {association.bio && (
              <p className="text-gray-600 mt-2">{association.bio}</p>
            )}
          </div>
        </div>
        <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3">
          <Link to="/missions/new">
            <Plus className="w-5 h-5 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions créées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{missions.length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Bénévoles mobilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalBenevoles}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Heures bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalHeures}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="hover:shadow-lg transition-shadow border-bleu/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bleu">
              <Plus className="w-5 h-5" />
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
        <Card className="hover:shadow-lg transition-shadow border-bleu/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bleu">
              <Users className="w-5 h-5" />
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
        <Card className="hover:shadow-lg transition-shadow border-bleu/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bleu">
              <BarChart2 className="w-5 h-5" />
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
      <Card>
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
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.mission_participants?.length || 0}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ouverte</Badge>
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
                          <Badge className="bg-blue-100 text-blue-800">{mission.status === 'completed' ? 'Terminée' : 'Fermée'}</Badge>
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

export default AssociationProfile;
