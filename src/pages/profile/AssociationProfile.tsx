
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile, Mission } from "@/types/mission";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const AssociationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [association, setAssociation] = useState<Profile | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (id) {
      fetchAssociationAndMissions();
    }
  }, [id]);

  const fetchAssociationAndMissions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer le profil de l'association
      const { data: associationData, error: associationError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .eq("is_association", true)
        .single();

      if (associationError) {
        throw new Error("Association introuvable");
      }

      setAssociation(associationData);

      // Récupérer les missions de l'association
      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select("*")
        .eq("association_id", id)
        .order("starts_at", { ascending: true });

      if (missionsError) throw missionsError;

      setMissions(missionsData || []);
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  if (loading) {
    return (
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-6" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />

                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-4">
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
              </CardContent>
            </Card>
          </div>
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
            <p className="text-gray-500 mb-4">
              {error || "L'association que vous recherchez n'existe pas."}
            </p>
            <Button asChild>
              <a href="/missions">Voir toutes les missions</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Séparer les missions actives (à venir) et passées
  const currentDate = new Date();
  const upcomingMissions = missions.filter((m) => new Date(m.starts_at) >= currentDate && m.status === 'open');
  const pastMissions = missions.filter((m) => new Date(m.starts_at) < currentDate || m.status !== 'open');

  return (
    <div className="container-custom py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={association.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(association.first_name, association.last_name)}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">
                  {association.first_name} {association.last_name}
                </h1>
                {association.location && (
                  <div className="flex items-center text-gray-500 mt-1 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{association.location}</span>
                  </div>
                )}
                {association.bio && (
                  <p className="text-gray-600 text-center">{association.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full border-b rounded-none">
                  <TabsTrigger value="about" className="flex-1">À propos</TabsTrigger>
                  <TabsTrigger value="missions" className="flex-1">Missions ({upcomingMissions.length})</TabsTrigger>
                  <TabsTrigger value="past-missions" className="flex-1">Missions passées ({pastMissions.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="p-6">
                  <h2 className="text-xl font-bold mb-4">À propos de l'association</h2>
                  {association.bio ? (
                    <p className="text-gray-600">{association.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Aucune information disponible pour cette association.
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="missions" className="p-6">
                  <h2 className="text-xl font-bold mb-4">Missions à venir</h2>
                  {upcomingMissions.length === 0 ? (
                    <p className="text-gray-500">
                      Aucune mission à venir pour cette association.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingMissions.map((mission) => (
                        <Card key={mission.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <a 
                              href={`/missions/${mission.id}`}
                              className="font-medium text-lg text-bleu hover:underline"
                            >
                              {mission.title}
                            </a>
                            <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(mission.starts_at)}</span>
                              <span className="mx-2">•</span>
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{mission.city}</span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                              {mission.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm text-gray-500">
                                <span>Places: {mission.spots_available - mission.spots_taken}/{mission.spots_available}</span>
                              </div>
                              <Badge variant={mission.status === 'open' ? 'default' : 'secondary'}>
                                {mission.status === 'open' ? 'Ouverte' : 'Complète'}
                              </Badge>
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
                    <p className="text-gray-500">
                      Aucune mission passée pour cette association.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pastMissions.map((mission) => (
                        <Card key={mission.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <a 
                              href={`/missions/${mission.id}`}
                              className="font-medium text-lg text-bleu hover:underline"
                            >
                              {mission.title}
                            </a>
                            <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(mission.starts_at)}</span>
                              <span className="mx-2">•</span>
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{mission.city}</span>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {mission.description}
                            </p>
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
      </div>
    </div>
  );
};

export default AssociationProfile;
