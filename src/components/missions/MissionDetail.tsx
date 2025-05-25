import { useMissionDetails } from "@/hooks/useMissionDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration } from "@/utils/date";
import { MapPin, Clock, Users, Briefcase, Target, Award } from "lucide-react";
import { useParams } from "react-router-dom";

export function MissionDetail() {
  const { missionId } = useParams<{ missionId: string }>();
  const {
    mission,
    isLoading,
    participate,
    updateRegistrationStatus,
    isParticipating,
    isUpdatingStatus
  } = useMissionDetails(missionId!);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!mission) {
    return <div>Mission non trouvée</div>;
  }

  const handleParticipation = () => {
    if (mission.is_registered) {
      updateRegistrationStatus({ status: "annulé" });
    } else {
      participate();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{mission.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{mission.format}</Badge>
              <Badge variant="outline">{mission.difficulty_level}</Badge>
              <Badge variant="outline">{mission.engagement_level}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{mission.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Impact recherché</h3>
                <p className="text-muted-foreground">{mission.desired_impact}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{mission.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDuration(mission.duration_minutes)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{mission.participants_count} participant(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{mission.mission_type.name}</span>
                </div>
              </div>

              {mission.required_skills.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Compétences requises</h3>
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

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Organisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {mission.organization.logo_url && (
                      <img
                        src={mission.organization.logo_url}
                        alt={mission.organization.organization_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {mission.organization.organization_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {mission.organization.sector.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails de la mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Date de début :</span>{" "}
                      {formatDate(mission.start_date)}
                    </div>
                    {mission.end_date && (
                      <div>
                        <span className="font-medium">Date de fin :</span>{" "}
                        {formatDate(mission.end_date)}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Places disponibles :</span>{" "}
                      {mission.available_spots}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                onClick={handleParticipation}
                disabled={isParticipating || isUpdatingStatus}
              >
                {mission.is_registered ? "Annuler la participation" : "Participer"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 