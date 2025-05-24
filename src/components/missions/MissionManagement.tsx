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
import { MissionWithAssociation, MissionStatus } from '@/types/mission';
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
  const { data: missions, isLoading, refetch } = useAssociationMissions(associationId);
  const [expandedMissions, setExpandedMissions] = useState<Record<string, boolean>>({});
  
  const handleStatusChange = async (missionId: string, newStatus: MissionStatus) => {
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: newStatus })
        .eq('id', missionId);
      
      if (error) throw error;
      
      toast.success(`Statut de la mission mis à jour avec succès`);
      refetch();
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  };
  
  const handleDuplicate = async (missionId: string) => {
    try {
      const { data: mission, error: fetchError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const { error: insertError } = await supabase
        .from('missions')
        .insert({
          ...mission,
          id: undefined,
          title: `${mission.title} (copie)`,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      toast.success(`Mission dupliquée avec succès`);
      refetch();
    } catch (error: any) {
      toast.error(`Erreur lors de la duplication: ${error.message}`);
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">{mission.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {getStatusBadge(mission.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/missions/${mission.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(mission.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Dupliquer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange(mission.id, 'cancelled')}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Annuler
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{format(new Date(mission.starts_at || mission.start_date), 'PPP', { locale: fr })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{mission.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{mission.spots_taken || 0}/{mission.spots_available || mission.available_spots} participants</span>
              </div>
            </div>
            
            {expandedMissions[mission.id] && (
              <div className="mt-4 space-y-4">
                <div className="text-sm text-gray-600">
                  {mission.description}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Participants</h4>
                  {mission.mission_participants && mission.mission_participants.length > 0 ? (
                    <div className="space-y-2">
                      {mission.mission_participants.map((p) => (
                        <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>
                            {p.profiles?.first_name} {p.profiles?.last_name}
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
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              variant="ghost" 
              onClick={() => toggleMissionDetails(mission.id)}
              className="w-full"
            >
              {expandedMissions[mission.id] ? 'Réduire' : 'Voir les détails'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
