
import { useMissionDetails } from "@/hooks/useMissionDetails";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration } from "@/utils/date";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    mission,
    isLoading,
    participate,
    updateRegistrationStatus,
    isParticipating,
    isUpdatingStatus
  } = useMissionDetails(id!);

  const handleParticipation = async () => {
    if (!user) return;

    if (mission?.is_registered) {
      updateRegistrationStatus({ status: "annulé" });
    } else {
      participate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!mission) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Mission non trouvée</h2>
        <p className="text-gray-600">Cette mission n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  const canParticipate = user && !mission.is_registered && mission.participants_count < mission.available_spots;
  const canCancel = user && mission.is_registered && mission.registration_status !== "terminé";

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
            {mission.is_registered && (
              <Badge variant="outline">
                {mission.registration_status}
              </Badge>
            )}
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
          ) : (
            <div className="w-full space-y-2">
              {canParticipate && (
                <Button 
                  className="w-full"
                  onClick={handleParticipation}
                  disabled={isParticipating}
                >
                  {isParticipating ? "Inscription en cours..." : "Participer à cette mission"}
                </Button>
              )}
              
              {canCancel && (
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleParticipation}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Annulation en cours..." : "Annuler ma participation"}
                </Button>
              )}
              
              {mission.is_registered && mission.registration_status === "terminé" && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">
                    Mission terminée - Merci pour votre participation !
                  </p>
                </div>
              )}
              
              {!canParticipate && !mission.is_registered && mission.participants_count >= mission.available_spots && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600">
                    Mission complète - Plus de places disponibles
                  </p>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
