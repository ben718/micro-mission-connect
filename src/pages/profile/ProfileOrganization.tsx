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
import { MissionWithDetails } from "@/types/mission";
import { formatDate, formatDuration } from "@/utils/date";

const ProfileOrganization = () => {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<MissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("missions");

  useEffect(() => {
    const fetchMissions = async () => {
      if (!user || !profile?.organization) return;

      try {
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select(`
            *,
            organization:organization_id(
              *,
              sector:organization_sectors(*)
            ),
            mission_type:mission_types(*),
            mission_skills(
              *,
              skill:skills(*)
            ),
            mission_registrations(
              *,
              user:user_id(
                *,
                user_skills(
                  *,
                  skill:skills(*)
                )
              )
            )
          `)
          .eq("organization_id", profile.organization.id)
          .order("created_at", { ascending: false });

        if (missionsError) throw missionsError;

        const transformedMissions = missionsData.map((mission: any) => ({
          ...mission,
          required_skills: mission.mission_skills.map((ms: any) => ms.skill.name),
          participants_count: mission.mission_registrations.filter((r: any) => r.status === "confirmé").length,
          is_registered: false,
          available_spots: mission.available_spots - mission.mission_registrations.filter((r: any) => r.status === "confirmé").length
        }));

        setMissions(transformedMissions);
      } catch (error) {
        console.error("Erreur lors de la récupération des missions:", error);
        toast.error("Erreur lors de la récupération des missions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, [user, profile]);

  if (!profile?.organization) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profil d'organisation non trouvé</h1>
          <p className="text-muted-foreground">
            Veuillez compléter votre profil d'organisation pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.organization.logo_url || undefined} />
              <AvatarFallback>
                {profile.organization.organization_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.organization.organization_name}</h1>
              <p className="text-muted-foreground">{profile.organization.sector?.name}</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/missions/new">Créer une mission</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : missions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missions.map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{mission.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{mission.format}</Badge>
                        <Badge variant="outline">{mission.difficulty_level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground line-clamp-3">
                          {mission.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{mission.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDuration(mission.duration_minutes)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{mission.participants_count} participant(s)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(mission.start_date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{mission.status}</Badge>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/missions/${mission.id}`}>Voir les détails</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé de mission.</p>
                <Button asChild>
                  <Link to="/missions/new">Créer votre première mission</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileOrganization; 