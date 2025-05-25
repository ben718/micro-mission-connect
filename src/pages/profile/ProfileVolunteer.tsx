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
import { Users, Clock, Calendar, MapPin, Award, Star } from "lucide-react";
import { toast } from 'sonner';
import { MissionWithDetails } from "@/types/mission";
import { formatDate, formatDuration } from "@/utils/date";

const ProfileVolunteer = () => {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<MissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("missions");

  useEffect(() => {
    const fetchMissions = async () => {
      if (!user) return;

      try {
        const { data: missionsData, error: missionsError } = await supabase
          .from("mission_registrations")
          .select(`
            *,
            mission:mission_id(
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
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (missionsError) throw missionsError;

        const transformedMissions = missionsData.map((registration: any) => ({
          ...registration.mission,
          required_skills: registration.mission.mission_skills.map((ms: any) => ms.skill.name),
          participants_count: registration.mission.mission_registrations.filter((r: any) => r.status === "confirmé").length,
          is_registered: true,
          registration_status: registration.status,
          available_spots: registration.mission.available_spots - registration.mission.mission_registrations.filter((r: any) => r.status === "confirmé").length
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
  }, [user]);

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
          <p className="text-muted-foreground">
            Veuillez compléter votre profil pour accéder à cette page.
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
              <AvatarImage src={profile.profile_picture_url || undefined} />
              <AvatarFallback>
                {profile.first_name?.charAt(0)}
                {profile.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/missions">Découvrir des missions</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="missions">Mes missions</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
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
                          <Badge variant="secondary">{mission.registration_status}</Badge>
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
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore participé à des missions.</p>
                <Button asChild>
                  <Link to="/missions">Découvrir des missions</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Mes compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.skills?.map((userSkill) => (
                    <Card key={userSkill.skill.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{userSkill.skill.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Niveau: {userSkill.level}
                            </p>
                          </div>
                          <Star className="h-5 w-5 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Mes badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.badges?.map((userBadge) => (
                    <Card key={userBadge.badge.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{userBadge.badge.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Obtenu le {formatDate(userBadge.acquired_at || userBadge.acquisition_date)}
                            </p>
                          </div>
                          <Award className="h-5 w-5 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileVolunteer;
