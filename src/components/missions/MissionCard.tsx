
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { MissionWithDetails } from "@/types";

interface MissionCardProps {
  mission: MissionWithDetails;
}

const MissionCard = ({ mission }: MissionCardProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: fr });
  };

  const getDurationText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  };

  const getFormatBadgeColor = (format?: string) => {
    switch (format) {
      case 'Présentiel':
        return 'bg-blue-100 text-blue-800';
      case 'À distance':
        return 'bg-green-100 text-green-800';
      case 'Hybride':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyBadgeColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'débutant':
        return 'bg-green-100 text-green-800';
      case 'intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold line-clamp-2 flex-1">
            {mission.title}
          </h3>
          <Badge variant="outline" className="shrink-0">
            <Users className="h-3 w-3 mr-1" />
            {mission.available_spots_remaining || 0}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mission.format && (
            <Badge className={getFormatBadgeColor(mission.format)}>
              {mission.format}
            </Badge>
          )}
          {mission.difficulty_level && (
            <Badge className={getDifficultyBadgeColor(mission.difficulty_level)}>
              {mission.difficulty_level}
            </Badge>
          )}
          {mission.mission_type && (
            <Badge variant="secondary">
              {mission.mission_type.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {mission.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(mission.start_date)} à {formatTime(mission.start_date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Durée: {getDurationText(mission.duration_minutes)}</span>
          </div>

          {mission.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{mission.location}</span>
            </div>
          )}

          {mission.engagement_level && (
            <div className="text-xs text-blue-600 font-medium">
              {mission.engagement_level}
            </div>
          )}
        </div>

        {mission.mission_skills && mission.mission_skills.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {mission.mission_skills.slice(0, 3).map((missionSkill) => (
                <Badge 
                  key={missionSkill.id} 
                  variant="outline" 
                  className="text-xs"
                >
                  {missionSkill.skills?.name}
                </Badge>
              ))}
              {mission.mission_skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{mission.mission_skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mission.organization_profile?.logo_url || ""} />
            <AvatarFallback>
              <Building className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-1">
              {mission.organization_profile?.organization_name}
            </span>
            {mission.organization_profile?.organization_sectors && (
              <span className="text-xs text-gray-500">
                {mission.organization_profile.organization_sectors.name}
              </span>
            )}
          </div>
        </div>
        
        <Button asChild size="sm">
          <Link to={`/missions/${mission.id}`}>
            Voir plus
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MissionCard;
