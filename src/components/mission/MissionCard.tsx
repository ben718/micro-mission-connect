
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import type { MissionWithOrganization } from "@/types/mission";

interface MissionCardProps {
  mission: MissionWithOrganization;
}

export function MissionCard({ mission }: MissionCardProps) {
  // Utiliser les vraies données de la base
  const organizationName = mission.organization?.organization_name || 'Organisation';
  
  const formattedDate = mission.start_date ? 
    new Date(mission.start_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 
    'Date non spécifiée';
  
  const formattedTime = mission.start_date ? 
    new Date(mission.start_date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : '';
  
  const formattedDuration = mission.duration_minutes ? 
    `${Math.floor(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 > 0 ? ` ${mission.duration_minutes % 60}min` : ''}` : 
    '';
  
  const formattedLocation = mission.location || mission.address || '';
  
  const formattedParticipants = `${mission.participants_count || 0}/${mission.available_spots || 0}`;
  
  const skills = mission.required_skills || [];
  const missionType = mission.mission_type?.name || 'Général';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">
              <Link to={`/missions/${mission.id}`} className="hover:underline">
                {mission.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {organizationName}
            </p>
          </div>
          <Badge variant="outline">{missionType}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {mission.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {formattedDate}
          </div>

          {(formattedTime || formattedDuration) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              {formattedTime} {formattedTime && formattedDuration && '-'} {formattedDuration}
            </div>
          )}

          {formattedLocation && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {formattedLocation}
            </div>
          )}

          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            {formattedParticipants} participants
          </div>

          {skills.length > 0 && (
            <div className="flex items-start text-sm text-muted-foreground">
              <Tag className="h-4 w-4 mr-2 mt-1" />
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button asChild className="w-full">
          <Link to={`/missions/${mission.id}`}>
            Voir les détails
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MissionCard;
