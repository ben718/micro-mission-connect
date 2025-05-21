
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import MissionCard from "@/components/missions/MissionCard";
import { MissionWithAssociation } from "@/types/mission";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [recommendedMissions, setRecommendedMissions] = useState<MissionWithAssociation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Récupérer les missions de l'utilisateur
      if (!profile?.is_association) {
        const { data: participations } = await supabase
          .from("mission_participants")
          .select(`
            *,
            mission:mission_id(
              *,
              association:association_id(*)
            )
          `)
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        setUserMissions(participations || []);
      }

      // Récupérer des missions recommandées
      let query = supabase
        .from("missions")
        .select(`
          *,
          association:association_id(*)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      // Si c'est une association, exclure ses propres missions
      if (profile?.is_association) {
        query = query.neq("association_id", user?.id);
      }

      const { data: missions } = await query.limit(3);
      setRecommendedMissions(missions as MissionWithAssociation[] || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Vous n'êtes pas connecté</h2>
          <p className="text-gray-500 mb-4">Connectez-vous pour accéder à votre tableau de bord.</p>
          <Button asChild>
            <Link to="/auth/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tableau de bord | MicroBénévole</title>
      </Helmet>
      <div className="container-custom py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {profile?.first_name || "bénévole"}
          </h1>
          <p className="text-gray-600">
            {profile?.is_association
              ? "Gérez vos missions et découvrez d'autres associations."
              : "Découvrez des missions qui correspondent à votre profil."}
          </p>
        </div>

        {profile?.is_association ? (
          // Interface pour les associations
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gérer mes missions</CardTitle>
                  <CardDescription>Consultez et gérez les missions que vous avez créées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                      <Button asChild>
                        <Link to="/missions/new">Créer une nouvelle mission</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/profile">Voir toutes mes missions</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                  <CardDescription>Aperçu de votre activité</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Missions créées</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bénévoles inscrits</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Missions terminées</p>
                      <p className="text-2xl font-bold">--</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Interface pour les bénévoles
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Mes missions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList>
                      <TabsTrigger value="upcoming">À venir</TabsTrigger>
                      <TabsTrigger value="past">Passées</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming" className="pt-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow p-4">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-4" />
                              <Skeleton className="h-20 w-full mb-3" />
                            </div>
                          ))}
                        </div>
                      ) : userMissions.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500">
                            Vous n'êtes inscrit à aucune mission pour le moment.
                          </p>
                          <Button className="mt-4 bg-bleu hover:bg-bleu-700" asChild>
                            <Link to="/missions">Trouver une mission</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userMissions
                            .filter(p => new Date(p.mission.starts_at) >= new Date())
                            .slice(0, 3)
                            .map((participation) => (
                              <Card key={participation.id}>
                                <CardContent className="p-4">
                                  <Link
                                    to={`/missions/${participation.mission.id}`}
                                    className="text-lg font-medium text-bleu hover:underline"
                                  >
                                    {participation.mission.title}
                                  </Link>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {new Date(participation.mission.starts_at).toLocaleDateString('fr-FR')} - {participation.mission.city}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          {userMissions.filter(p => new Date(p.mission.starts_at) >= new Date()).length > 3 && (
                            <Button variant="outline" className="w-full" asChild>
                              <Link to="/profile">Voir toutes mes missions</Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="past" className="pt-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow p-4">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-4" />
                              <Skeleton className="h-20 w-full mb-3" />
                            </div>
                          ))}
                        </div>
                      ) : userMissions.filter(p => new Date(p.mission.starts_at) < new Date()).length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-gray-500">
                            Vous n'avez pas encore participé à des missions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userMissions
                            .filter(p => new Date(p.mission.starts_at) < new Date())
                            .slice(0, 3)
                            .map((participation) => (
                              <Card key={participation.id}>
                                <CardContent className="p-4">
                                  <Link
                                    to={`/missions/${participation.mission.id}`}
                                    className="text-lg font-medium text-bleu hover:underline"
                                  >
                                    {participation.mission.title}
                                  </Link>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {new Date(participation.mission.starts_at).toLocaleDateString('fr-FR')} - {participation.mission.city}
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

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/missions">Trouver une mission</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/profile">Modifier mon profil</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section de recommandations pour tous les types d'utilisateurs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Missions recommandées</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full mb-3" />
                </div>
              ))}
            </div>
          ) : recommendedMissions.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">
                Aucune mission à recommander pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/missions">Voir toutes les missions</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
