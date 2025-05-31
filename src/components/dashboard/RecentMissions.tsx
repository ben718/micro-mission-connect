
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Mission {
  id: string;
  title: string;
  start_date: string;
  participants_count: number;
}

interface RecentMissionsProps {
  missions: Mission[];
}

export default function RecentMissions({ missions }: RecentMissionsProps) {
  const recentMissions = missions.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentMissions.length > 0 ? (
          <div className="space-y-4">
            {recentMissions.map((mission) => (
              <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium truncate">{mission.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(mission.start_date).toLocaleDateString('fr-FR')} • {mission.participants_count || 0} participants
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="ml-4 flex-shrink-0">
                  <Link to={`/missions/${mission.id}`}>Voir</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucune mission créée</p>
            <Button asChild>
              <Link to="/missions/new">Créer votre première mission</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
