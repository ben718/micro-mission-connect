
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, AlertCircle, Target, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    totalVolunteers: number;
    upcomingMissions: number;
    totalHours: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const successRate = stats.totalMissions > 0 
    ? Math.round((stats.completedMissions / stats.totalMissions) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missions totales</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMissions}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeMissions} actives
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bénévoles engagés</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
          <p className="text-xs text-muted-foreground">
            Toutes missions confondues
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Heures de bénévolat</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHours}h</div>
          <p className="text-xs text-muted-foreground">
            Temps total planifié
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missions à venir</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingMissions}</div>
          <p className="text-xs text-muted-foreground">
            Prochainement
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Missions terminées</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedMissions}</div>
          <p className="text-xs text-muted-foreground">
            Terminées avec succès
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            Missions réussies
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
