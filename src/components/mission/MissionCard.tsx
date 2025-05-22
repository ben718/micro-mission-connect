import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import type { MissionWithAssociation } from "@/types/mission";

interface MissionCardProps {
  mission: MissionWithAssociation;
}

export function MissionCard({ mission }: MissionCardProps) {
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
              {mission.association.name}
            </p>
          </div>
          <Badge variant="outline">{mission.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {mission.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(mission.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {mission.timeSlot} - {mission.duration} heures
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {mission.location}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            {mission.participants} participants
          </div>

          {mission.requiredSkills.length > 0 && (
            <div className="flex items-start text-sm text-muted-foreground">
              <Tag className="h-4 w-4 mr-2 mt-1" />
              <div className="flex flex-wrap gap-1">
                {mission.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
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