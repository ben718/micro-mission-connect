
import { MissionWithAssociation } from "@/types/mission";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface MissionCardProps {
  mission: MissionWithAssociation;
}

const MissionCard = ({ mission }: MissionCardProps) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH'h'mm", { locale: fr });
  };

  const getTimeUntil = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { 
      addSuffix: true,
      locale: fr 
    });
  };

  const getDurationText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return "1 heure";
    } else if (minutes % 60 === 0) {
      return `${minutes / 60} heures`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h${remainingMinutes}`;
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const isRemote = !mission.lat && !mission.lng;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold truncate">{mission.title}</h3>
          <Badge variant="outline">{mission.spots_available - mission.spots_taken} places</Badge>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <div className="flex items-center mr-4">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{isRemote ? "À distance" : mission.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(mission.starts_at)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{mission.description}</p>
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-3 h-3 mr-2" />
            <span>Durée: {getDurationText(mission.duration_minutes)}</span>
          </div>
          <div className="text-sm text-gray-500">
            {getTimeUntil(mission.starts_at)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {mission.skills_required?.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {skill}
            </Badge>
          ))}
          {mission.skills_required && mission.skills_required.length > 3 && (
            <Badge variant="secondary" className="bg-gray-100">
              +{mission.skills_required.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={mission.association?.avatar_url || ""} />
            <AvatarFallback>
              {getInitials(mission.association?.first_name, mission.association?.last_name)}
            </AvatarFallback>
          </Avatar>
          <Link 
            to={`/association/${mission.association?.id}`} 
            className="text-sm font-medium hover:underline"
          >
            {mission.association?.first_name} {mission.association?.last_name}
          </Link>
        </div>
        <Link to={`/missions/${mission.id}`} className="text-bleu text-sm hover:underline">
          Voir plus
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MissionCard;
