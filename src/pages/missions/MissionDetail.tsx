import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MissionWithDetails, ParticipationStatus } from "@/types/mission";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration } from "@/utils/date";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { toast } from "sonner";

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: mission, isLoading } = useQuery({
    queryKey: ["mission", id],
    queryFn: async () => {
      const { data: mission } = await supabase
        .from("missions")
        .select(`
          *,
          organization:organization_id(
            *,
            sector:sector_id(*)
          ),
          mission_type:mission_type_id(*),
          mission_skills(
            *,
            skill:skill_id(*)
          )
        `)
        .eq("id", id)
        .single();

      const { count: participantsCount } = await supabase
        .from("mission_registrations")
        .select("*", { count: "exact" })
        .eq("mission_id", id)
        .eq("status", "inscrit");

      // Vérifier si l'utilisateur est inscrit
      let isRegistered = false;
      let registrationStatus: ParticipationStatus | undefined;
      if (user) {
        const { data: registration } = await supabase
          .from("mission_registrations")
          .select("status")
          .eq("mission_id", id)
          .eq("user_id", user.id)
          .single();
        
        if (registration) {
          isRegistered = true;
          registrationStatus = registration.status as ParticipationStatus;
        }
      }

      const transformedMission: MissionWithDetails = {
        ...mission,
        required_skills: mission.mission_skills?.map(ms => ms.skill.name) || [],
        participants_count: participantsCount || 0,
        is_registered: isRegistered,
        registration_status: registrationStatus,
        organization: mission.organization,
        mission_type: mission.mission_type,
        // Handle geo_location safely
        geo_location: mission.geo_location && typeof mission.geo_location === 'object' && 'type' in mission.geo_location && 'coordinates' in mission.geo_location
          ? mission.geo_location as { type: "Point"; coordinates: [number, number] }
          : null
      };

      return transformedMission;
    }
  });

  const participateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté pour participer");
      if (!mission) throw new Error("Mission non trouvée");

      const { error } = await supabase
        .from("mission_registrations")
        .insert({
          user_id: user.id,
          mission_id: mission.id,
          status: "inscrit" as ParticipationStatus,
          registration_date: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", id] });
      toast.success("Inscription réussie !");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const cancelParticipationMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté");
      if (!mission) throw new Error("Mission non trouvée");

      const { error } = await supabase
        .from("mission_registrations")
        .update({ status: "annulé" as ParticipationStatus })
        .eq("mission_id", mission.id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", id] });
      toast.success("Inscription annulée");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!mission) return <div>Mission non trouvée</div>;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={mission.format === 'Présentiel' ? 'default' : 'secondary'}>
              {mission.format}
            </Badge>
            <Badge variant="outline">
              {mission.difficulty_level}
            </Badge>
            <Badge variant="outline">
              {mission.engagement_level}
            </Badge>
          </div>
          <CardTitle>{mission.title}</CardTitle>
          <CardDescription>{mission.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{mission.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(mission.start_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(mission.duration_minutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{mission.participants_count} / {mission.available_spots} participants</span>
            </div>
            {mission.required_skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Compétences requises :</h3>
                <div className="flex flex-wrap gap-2">
                  {mission.required_skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {!user ? (
            <Button onClick={() => navigate("/login")}>
              Connectez-vous pour participer
            </Button>
          ) : mission.is_registered ? (
            <Button 
              variant="destructive"
              onClick={() => cancelParticipationMutation.mutate()}
              disabled={cancelParticipationMutation.isPending}
            >
              Annuler ma participation
            </Button>
          ) : (
            <Button 
              onClick={() => participateMutation.mutate()}
              disabled={participateMutation.isPending || mission.participants_count >= mission.available_spots}
            >
              Participer
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
