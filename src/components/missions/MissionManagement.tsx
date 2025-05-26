import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
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
  const { user } = useAuth();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const [statusFilter, setStatusFilter] = useState<MissionStatus[]>(['active']);
  
  const organizationId = organizationProfile?.id;
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
      'active': { label: 'Active', variant: 'default' as const },
      'terminée': { label: 'Terminée', variant: 'outline' as const },
      'annulée': { label: 'Annulée', variant: 'destructive' as const },
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
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Gestion des missions</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/missions/new">
            <Plus className="w-4 h-4 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter.includes('active') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['active'])}
          className="flex-1 sm:flex-none"
        >
          Missions actives
        </Button>
        <Button
          variant={statusFilter.includes('terminée') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['terminée'])}
          className="flex-1 sm:flex-none"
        >
          Terminées
        </Button>
        <Button
          variant={statusFilter.includes('annulée') ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['annulée'])}
          className="flex-1 sm:flex-none"
        >
          Annulées
        </Button>
        <Button
          variant={statusFilter.length > 1 ? 'default' : 'outline'}
          onClick={() => setStatusFilter(['active', 'terminée', 'annulée'])}
          className="flex-1 sm:flex-none"
        >
          Toutes
        </Button>
      </div>

      <div className="grid gap-4">
        {missions?.map((mission) => (
          <Card key={mission.id}>
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2 w-full sm:w-auto">
                  <CardTitle className="line-clamp-1 text-lg sm:text-xl">{mission.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">📅</span>
                      {formatDate(mission.start_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">⏱️</span>
                      {formatDuration(mission.duration_minutes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="hidden sm:inline">👥</span>
                      {mission.participants_count || 0}/{mission.available_spots} participants
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {getStatusBadge(mission.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-auto sm:ml-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}`} className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}/edit`} className="flex items-center">
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}/participants`} className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Participants ({mission.participants_count || 0})
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mission.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {missions?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center px-4 sm:px-6">
            <p className="text-muted-foreground mb-4">Aucune mission trouvée</p>
            <Button asChild className="w-full sm:w-auto">
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
