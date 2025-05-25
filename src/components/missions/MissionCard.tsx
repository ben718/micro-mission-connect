
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDuration } from "@/utils/date";
import { MapPin, Clock, Users, Briefcase } from "lucide-react";
import { MissionWithDetails } from "@/types/mission";
import { Link } from "react-router-dom";

interface MissionCardProps {
  mission: MissionWithDetails;
}

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-2">{mission.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{mission.format}</Badge>
            <Badge variant="outline">{mission.difficulty_level}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
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
              <span className="text-sm">{mission.participants_count || 0} participant(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{mission.mission_type?.name || 'Non spécifié'}</span>
            </div>
          </div>

          {mission.required_skills && mission.required_skills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Compétences requises</h4>
              <div className="flex flex-wrap gap-2">
                {mission.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Début : {formatDate(mission.start_date)}
              </span>
              <span className="text-sm text-muted-foreground">
                {mission.available_spots} place(s) disponible(s)
              </span>
            </div>
            <Button asChild className="w-full">
              <Link to={`/missions/${mission.id}`}>
                Voir les détails
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
