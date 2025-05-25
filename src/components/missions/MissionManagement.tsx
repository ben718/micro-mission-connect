
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationMissions, useMissionActions } from "@/hooks/useMissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Eye, Edit, Trash2, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import type { MissionStatus } from "@/types/mission";

const MissionManagement = () => {
  const { profile } = useAuth();
  const [statusFilter, setStatusFilter] = useState<MissionStatus[]>(['active', 'draft']);
  
  const organizationId = profile?.organization?.id;
  const { data: missions, isLoading } = useOrganizationMissions(organizationId, statusFilter);
  const { updateMissionStatus } = useMissionActions();

  const handleStatusChange = async (missionId: string, newStatus: MissionStatus) => {
    try {
      await updateMissionStatus.mutateAsync({ missionId, status: newStatus });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'draft': { label: 'Brouillon', variant: 'secondary' as const },
      'active': { label: 'Active', variant: 'default' as const },
      'in_progress': { label: 'En cours', variant: 'default' as const },
      'completed': { label: 'Terminée', variant: 'outline' as const },
      'cancelled': { label: 'Annulée', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}` : `${remainingMinutes}min`;
  };

  if (isLoading) {
    return <div>Chargement des missions...</div>;
  }

  if (!organizationId) {
    return <div>Vous devez être connecté en tant qu'organisation pour voir cette page.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des missions</h1>
        <Button asChild>
          <Link to="/missions/new">
            <Plus className="w-4 h-4 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={statusFilter.includes('active') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['active'])}
        >
          Missions actives
        </Button>
        <Button
          variant={statusFilter.includes('draft') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['draft'])}
        >
          Brouillons
        </Button>
        <Button
          variant={statusFilter.includes('completed') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['completed'])}
        >
          Terminées
        </Button>
        <Button
          variant={statusFilter.includes('cancelled') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['cancelled'])}
        >
          Annulées
        </Button>
        <Button
          variant={statusFilter.length > 1 ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['active', 'draft', 'completed', 'cancelled'])}
        >
          Toutes
        </Button>
      </div>

      <div className="grid gap-4">
        {missions?.map((mission) => (
          <Card key={mission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="line-clamp-1">{mission.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>📅 {formatDate(mission.start_date)}</span>
                    <span>⏱️ {formatDuration(mission.duration_minutes)}</span>
                    <span>👥 {mission.participants_count || 0}/{mission.available_spots} participants</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(mission.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}/participants`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Participants ({mission.participants_count || 0})
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mission.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {missions?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Aucune mission trouvée</p>
            <Button asChild>
              <Link to="/missions/new">
                <Plus className="w-4 h-4 mr-2" />
                Créer votre première mission
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MissionManagement;
