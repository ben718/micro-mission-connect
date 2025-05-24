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
      case 'open':
        return <Badge className="bg-green-100 text-green-800">Publiée</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'filled':
        return <Badge className="bg-orange-100 text-orange-800">Complète</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Clôturée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{mission.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(mission.status)}
              {mission.association && (
                <Badge variant="secondary">
                  {mission.association.first_name} {mission.association.last_name}
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
            <span>{format(new Date(mission.starts_at || mission.start_date), 'Pp', { locale: fr })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Durée: {mission.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {mission.spots_taken || 0}/{mission.spots_available || mission.available_spots} participants
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
        {onRegister && mission.status === 'open' && !isRegistered && (
          <Button 
            size="sm" 
            onClick={onRegister}
            disabled={mission.spots_taken >= (mission.spots_available || mission.available_spots)}
          >
            S'inscrire
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
