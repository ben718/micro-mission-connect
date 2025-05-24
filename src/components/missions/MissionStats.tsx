import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Target, Award } from "lucide-react";

interface MissionStatsProps {
  totalMissions: number;
  activeMissions: number;
  totalParticipants: number;
  averageDuration: number;
  topSkills: Array<{
    name: string;
    count: number;
  }>;
  topSectors: Array<{
    name: string;
    count: number;
  }>;
}

const MissionStats = ({
  totalMissions,
  activeMissions,
  totalParticipants,
  averageDuration,
  topSkills,
  topSectors,
}: MissionStatsProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
      : `${remainingMinutes}min`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des missions</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMissions}</div>
          <p className="text-xs text-muted-foreground">
            {activeMissions} missions actives
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParticipants}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(totalParticipants / totalMissions)} par mission
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(averageDuration)}
          </div>
          <p className="text-xs text-muted-foreground">
            par mission
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top compétences</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topSkills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between">
                <span className="text-sm">{skill.name}</span>
                <Badge variant="secondary">{skill.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Secteurs d'activité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topSectors.map((sector) => (
              <div key={sector.name} className="flex items-center justify-between">
                <span className="text-sm">{sector.name}</span>
                <Badge variant="secondary">{sector.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionStats; 