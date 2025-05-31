
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Mission } from "@/types/mission";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSavedMissions } from "@/hooks/useSavedMissions";
import { useAuth } from "@/hooks/useAuth";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { user } = useAuth();
  const { isSaved, save, unsave, isSaveLoading, isUnsaveLoading } = useSavedMissions(user?.id, mission.id);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      unsave();
    } else {
      save();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header avec titre et bouton save */}
          <div className="flex justify-between items-start gap-3">
            <Link 
              to={`/missions/${mission.id}`}
              className="flex-1 min-w-0"
            >
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 hover:text-primary transition-colors line-clamp-2">
                {mission.title}
              </h3>
            </Link>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveToggle}
                disabled={isSaveLoading || isUnsaveLoading}
                className="flex-shrink-0 p-2"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Organisation */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-sm text-gray-700 truncate">
              {mission.organization?.organization_name}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {mission.description}
          </p>

          {/* Informations mission - responsive grid */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {format(new Date(mission.start_date), 'dd MMM yyyy', { locale: fr })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {mission.location}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {mission.participants_count || 0} / {mission.available_spots} participant(s)
              </span>
            </div>
          </div>

          {/* Badges - responsive */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">{mission.format}</Badge>
            <Badge variant="secondary" className="text-xs">{mission.difficulty_level}</Badge>
            {mission.available_spots && (
              <Badge variant="outline" className="text-xs">
                {(mission.available_spots - (mission.participants_count || 0))} places restantes
              </Badge>
            )}
          </div>

          {/* Bouton d'action */}
          <Link to={`/missions/${mission.id}`}>
            <Button variant="outline" size="sm" className="w-full text-sm">
              Voir les détails
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
