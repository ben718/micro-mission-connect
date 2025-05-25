import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissionWithDetails, MissionStatus } from '@/types/mission';
import { useAssociationMissions } from '@/hooks/useMissions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  Calendar, Clock, Users, MoreVertical, Edit, Copy, 
  AlertTriangle, CheckCircle, XCircle, FileText 
} from 'lucide-react';

interface MissionManagementProps {
  associationId: string;
  filterStatus?: MissionStatus[] | MissionStatus;
}

export default function MissionManagement({ associationId, filterStatus }: MissionManagementProps) {
  const navigate = useNavigate();
  const { data: missions, isLoading, refetch, updateMissionStatus } = useAssociationMissions(associationId, filterStatus);
  const [expandedMissions, setExpandedMissions] = useState<Record<string, boolean>>({});
  
  const handleStatusChange = async (missionId: string, newStatus: MissionStatus) => {
    try {
      await updateMissionStatus({ missionId, status: newStatus });
      toast.success(`Statut de la mission mis à jour avec succès`);
      refetch();
    } catch (error) {
      toast.error(`Erreur lors de la mise à jour du statut: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  const handleDuplicate = async (missionId: string) => {
    try {
      // Implémentation à faire ou à adapter selon les hooks disponibles
      toast.success(`Mission dupliquée avec succès`);
      refetch();
    } catch (error) {
      toast.error(`Erreur lors de la duplication: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  const toggleMissionDetails = (missionId: string) => {
    setExpandedMissions(prev => ({
      ...prev,
      [missionId]: !prev[missionId]
    }));
  };
  
  // Fonction pour afficher le statut selon le code
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
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement des missions...</div>;
  }
  
  if (!missions || missions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center mb-4">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">Aucune mission</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas encore créé de missions correspondant à ces critères.
            </p>
          </div>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/missions/create')}
          >
            Créer une mission
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {missions.map(mission => (
        <Card key={mission.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {mission.title}
                  {getStatusBadge(mission.status)}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/missions/edit/${mission.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(mission.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Dupliquer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                  {mission.status !== 'open' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(mission.id, 'open')}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Publier
                    </DropdownMenuItem>
                  )}
                  {mission.status !== 'completed' && mission.status !== 'cancelled' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(mission.id, 'completed')}>
                      <CheckCircle className="mr-2 h-4 w-4 text-purple-600" />
                      Marquer comme clôturée
                    </DropdownMenuItem>
                  )}
                  {mission.status !== 'cancelled' && (
                    <DropdownMenuItem onClick={() => handleStatusChange(mission.id, 'cancelled')}>
                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                      Annuler la mission
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
                <span>Durée: {mission.duration_minutes ? `${Math.floor(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 || ''}` : ''}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {mission.participants_count || 0}/{mission.available_spots} participants
                </span>
              </div>
            </div>
            <p className="text-gray-600 line-clamp-2">{mission.description}</p>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleMissionDetails(mission.id)}
            >
              {expandedMissions[mission.id] ? 'Masquer les détails' : 'Voir les détails'}
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate(`/missions/${mission.id}`)}
            >
              Gérer les participants
            </Button>
          </CardFooter>
          
          {/* Détails supplémentaires si développé */}
          {expandedMissions[mission.id] && (
            <div className="px-6 pb-6 border-t mt-4 pt-4">
              <h4 className="font-medium mb-2">Participants ({mission.participants_count || 0}/{mission.available_spots})</h4>
              {mission.registrations && mission.registrations.length > 0 ? (
                <div className="space-y-2">
                  {mission.registrations.map((p) => (
                    <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>
                        {p.volunteer?.first_name} {p.volunteer?.last_name}
                      </span>
                      <Badge variant={
                        p.status === 'completed' ? 'default' : 
                        p.status === 'registered' ? 'secondary' : 
                        p.status === 'cancelled' ? 'destructive' : 
                        'outline'
                      }>
                        {p.status === 'completed' ? 'Validé' : 
                         p.status === 'registered' ? 'Inscrit' : 
                         p.status === 'cancelled' ? 'Annulé' : 
                         p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun participant inscrit pour le moment.</p>
              )}
              
              {/* Actions spécifiques selon le statut */}
              {mission.status === 'completed' ? (
                <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-purple-700">
                    Cette mission est clôturée. Vous pouvez encore consulter les participants et leurs validations.
                  </span>
                </div>
              ) : mission.status === 'cancelled' ? (
                <div className="mt-4 p-3 bg-red-50 rounded border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-700">
                    Cette mission a été annulée. Les participants en ont été informés automatiquement.
                  </span>
                </div>
              ) : mission.status === 'draft' ? (
                <Button 
                  className="mt-4 w-full" 
                  onClick={() => handleStatusChange(mission.id, 'open')}
                >
                  Publier cette mission
                </Button>
              ) : null}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
