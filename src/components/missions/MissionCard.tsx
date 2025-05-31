
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MissionCardProps {
  mission: any;
}

export function MissionCard({ mission }: MissionCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex gap-1 flex-wrap">
            {mission.format && (
              <Badge variant="secondary" className="text-xs">
                {mission.format}
              </Badge>
            )}
            {mission.difficulty_level && (
              <Badge variant="outline" className="text-xs">
                {mission.difficulty_level}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Titre complet sans troncature */}
        <h3 className="font-semibold text-lg leading-tight mb-2">
          {mission.title}
        </h3>
        
        {/* Description avec limitation de lignes mais titre complet */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {mission.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {mission.start_date ? 
                format(new Date(mission.start_date), "dd MMM yyyy", { locale: fr }) : 
                "Date à définir"
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {mission.duration_minutes ? formatDuration(mission.duration_minutes) : "Durée à définir"}
            </span>
          </div>
          
          {mission.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{mission.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {mission.participants_count || 0} / {mission.available_spots || 1} participants
            </span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <p className="font-medium">{mission.organization?.organization_name || "Organisation"}</p>
              {mission.mission_type && (
                <p className="text-muted-foreground">{mission.mission_type.name}</p>
              )}
            </div>
          </div>
          
          <Button asChild className="w-full">
            <Link to={`/missions/${mission.id}`}>
              Voir les détails
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
