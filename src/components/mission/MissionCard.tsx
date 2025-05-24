
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissionWithAssociation } from '@/types/mission';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface MissionCardProps {
  mission: MissionWithAssociation;
  onRegister?: () => void;
  isRegistered?: boolean;
}

export default function MissionCard({ mission, onRegister, isRegistered }: MissionCardProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Publiée</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Clôturée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const availableSpots = mission.available_spots_remaining || 
    Math.max(0, (mission.available_spots || 0) - (mission.mission_registrations?.length || 0));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{mission.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(mission.status)}
              {mission.organization_profiles && (
                <Badge variant="secondary">
                  {mission.organization_profiles.organization_name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(new Date(mission.start_date), 'Pp', { locale: fr })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Durée: {mission.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {(mission.mission_registrations?.length || 0)}/{mission.available_spots} participants
            </span>
          </div>
          {mission.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{mission.location}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 line-clamp-2">{mission.description}</p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/missions/${mission.id}`)}
        >
          Voir les détails
        </Button>
        {onRegister && mission.status === 'active' && !isRegistered && (
          <Button 
            size="sm" 
            onClick={onRegister}
            disabled={availableSpots <= 0}
          >
            S'inscrire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
