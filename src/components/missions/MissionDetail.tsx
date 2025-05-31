import { useMissionDetails } from "@/hooks/useMissionDetails";
import { useSavedMissions } from "@/hooks/useSavedMissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration } from "@/utils/date";
import { MapPin, Clock, Users, Briefcase, Target, Award, Bookmark, BookmarkCheck } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MissionDetailProps {
  missionId: string;
}

export default function MissionDetail({ missionId }: MissionDetailProps) {
  const { user } = useAuth();
  const {
    mission,
    isLoading,
    participate,
    updateRegistrationStatus,
    isParticipating,
    isUpdatingStatus
  } = useMissionDetails(missionId);

  const { isSaved, save, unsave, isSaveLoading, isUnsaveLoading } = useSavedMissions(user?.id, missionId);

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

  const handleParticipation = async () => {
    if (!user) return;

    if (mission.is_registered && mission.registration_status !== "annulé") {
      updateRegistrationStatus({ status: "annulé" });
    } else {
      participate();
    }
  };

  const handleSaveToggle = () => {
    if (isSaved) {
      unsave();
    } else {
      save();
    }
  };

  // Logique pour la limitation des annulations
  const isCancelled = mission.registration_status === "annulé";
  const isActivelyRegistered = mission.is_registered && !isCancelled;
  const hasAvailableSpots = mission.participants_count < mission.available_spots;
  const cancellationCount = mission.cancellation_count || 0;
  const hasReachedCancellationLimit = cancellationCount >= 2;
  
  // Un utilisateur peut participer s'il n'est pas activement inscrit ET qu'il y a des places ET qu'il n'a pas atteint la limite d'annulations
  const canParticipate = user && !isActivelyRegistered && hasAvailableSpots && !hasReachedCancellationLimit;
  // Un utilisateur peut annuler s'il est activement inscrit et que la mission n'est pas terminée
  const canCancel = user && isActivelyRegistered && mission.registration_status !== "terminé";

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{mission.title}</CardTitle>
              <div className="flex items-center gap-2">
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveToggle}
                    disabled={isSaveLoading || isUnsaveLoading}
                    className="flex items-center gap-2"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        Sauvegardé
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                )}
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

                {mission.desired_impact && (
                  <div>
                    <h3 className="font-medium mb-2">Impact recherché</h3>
                    <p className="text-muted-foreground">{mission.desired_impact}</p>
                  </div>
                )}

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
                    <span>{mission.participants_count} / {mission.available_spots} participant(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{mission.mission_type?.name}</span>
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
                    <Link 
                      to={`/organization/${mission.organization.id}`}
                      className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {mission.organization.logo_url && (
                          <img
                            src={mission.organization.logo_url}
                            alt={mission.organization.organization_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium hover:text-primary transition-colors">
                            {mission.organization.organization_name}
                          </h4>
                          {mission.organization.organization_sectors && (
                            <p className="text-sm text-muted-foreground">
                              {mission.organization.organization_sectors.name}
                            </p>
                          )}
                          <p className="text-xs text-primary mt-1">
                            Cliquez pour voir le profil →
                          </p>
                        </div>
                      </div>
                    </Link>
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
                        {mission.available_spots - mission.participants_count}
                      </div>
                      {mission.is_registered && (
                        <div>
                          <span className="font-medium">Statut :</span>{" "}
                          <Badge variant="outline">{mission.registration_status}</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {!user ? (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Connectez-vous pour participer à cette mission
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {canParticipate && (
                      <Button
                        className="w-full"
                        onClick={handleParticipation}
                        disabled={isParticipating}
                      >
                        {isParticipating ? "Inscription en cours..." : 
                         isCancelled ? "Participer à nouveau à cette mission" : "Participer à cette mission"}
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
                    
                    {!canParticipate && !canCancel && !hasAvailableSpots && !hasReachedCancellationLimit && (
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-600">
                          Mission complète - Plus de places disponibles
                        </p>
                      </div>
                    )}

                    {hasReachedCancellationLimit && (
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">
                          Vous avez atteint le nombre maximum d'annulations (2) pour cette mission.
                        </p>
                      </div>
                    )}

                    {isCancelled && !hasAvailableSpots && !hasReachedCancellationLimit && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Vous avez annulé cette mission. La mission est maintenant complète.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
