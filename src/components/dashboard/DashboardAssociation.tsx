import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { useOrganizationMissions } from "@/hooks/useMissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Clock, Calendar, MapPin, BarChart2, MoreVertical, Edit, Trash2, Share2, Eye, Pause } from "lucide-react";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DeleteMissionDialog from "@/components/missions/DeleteMissionDialog";
import SuspendMissionDialog from "@/components/missions/SuspendMissionDialog";
import ShareMissionDialog from "@/components/missions/ShareMissionDialog";
import MissionParticipantsDialog from "@/components/missions/MissionParticipantsDialog";

const DashboardAssociation = () => {
  const { user, profile } = useAuth();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const { data: missions, isLoading, error } = useOrganizationMissions(organizationProfile?.id);
  const [activeTab, setActiveTab] = useState("missions");
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [stats, setStats] = useState({
    totalBenevoles: 0,
    totalHeures: 0,
    tauxCompletion: 0
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);

  useEffect(() => {
    if (missions) {
      calculateStats();
    }
  }, [missions]);

  const calculateStats = async () => {
    try {
      if (!user || !missions) return;

      const uniqueVolunteers = new Set();
      let totalMinutes = 0;

      for (const mission of missions) {
        const { data: registrations } = await supabase
          .from("mission_registrations")
          .select("user_id")
          .eq("mission_id", mission.id);

        registrations?.forEach(reg => uniqueVolunteers.add(reg.user_id));
        totalMinutes += (mission.duration_minutes || 0) * (registrations?.length || 0);
      }

      const totalHours = Math.round(totalMinutes / 60);
      const totalMissions = missions.length;
      const completedMissions = missions.filter(m => m.status === "terminée").length;
      const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

      setStats({
        totalBenevoles: uniqueVolunteers.size,
        totalHeures: totalHours,
        tauxCompletion: completionRate
      });
    } catch (err) {
      console.error("Erreur lors du calcul des statistiques:", err);
    }
  };

  const handleMissionAction = (missionId: string, action: string) => {
    setSelectedMission(missionId);
    switch (action) {
      case "delete":
        setIsDeleteDialogOpen(true);
        break;
      case "suspend":
        setIsSuspendDialogOpen(true);
        break;
      case "share":
        setIsShareDialogOpen(true);
        break;
      case "participants":
        setIsParticipantsDialogOpen(true);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'active': { label: 'Active', variant: 'default' as const },
      'terminée': { label: 'Terminée', variant: 'outline' as const },
      'suspendue': { label: 'Suspendue', variant: 'destructive' as const },
      'annulée': { label: 'Annulée', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Erreur lors du chargement des missions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-500 mb-4">Profil d'organisation non trouvé</p>
            <Button asChild>
              <Link to="/profile">Compléter mon profil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDate = new Date();
  const upcomingMissions = missions?.filter((m) => new Date(m.start_date) >= currentDate && m.status === 'active') || [];
  const pastMissions = missions?.filter((m) => new Date(m.start_date) < currentDate || m.status !== 'active') || [];

  const activeMissions = missions?.filter((mission) => mission.status === "active") || [];
  const completedMissions = missions?.filter((mission) => mission.status === "completed") || [];
  const suspendedMissions = missions?.filter((mission) => mission.status === "suspended") || [];

  return (
    <div className="container-custom py-10">
      {/* Association header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.profile_picture_url || ""} />
            <AvatarFallback className="text-2xl">
              {profile?.first_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-bleu">{organizationProfile.organization_name}</h1>
            <p className="text-gray-600">Bienvenue sur votre tableau de bord d'association !</p>
            {organizationProfile.address && (
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-bleu" />
                <span>{organizationProfile.address}</span>
              </div>
            )}
          </div>
        </div>
        <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3 shadow-sm">
          <Link to="/missions/new">
            <Plus className="w-5 h-5 mr-2" />
            Créer une mission
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions créées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{missions?.length || 0}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Bénévoles engagés</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalBenevoles}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Heures de bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalHeures}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart2 className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.tauxCompletion}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Missions */}
      <Card className="border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b rounded-none">
              <TabsTrigger value="missions" className="flex-1">Missions à venir ({upcomingMissions.length})</TabsTrigger>
              <TabsTrigger value="past-missions" className="flex-1">Missions passées ({pastMissions.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="missions" className="p-6">
              <h2 className="text-xl font-bold mb-4">Missions à venir</h2>
              {upcomingMissions.length === 0 ? (
                <p className="text-gray-500">Aucune mission à venir.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingMissions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                            {mission.title}
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleMissionAction(mission.id, 'participants')}>
                                <Users className="w-4 h-4 mr-2" />
                                Voir les participants
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMissionAction(mission.id, 'share')}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Partager
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMissionAction(mission.id, 'suspend')}>
                                <Pause className="w-4 h-4 mr-2" />
                                Suspendre
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleMissionAction(mission.id, 'delete')}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.start_date)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{mission.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.participants_count || 0}</span>
                          </div>
                          {getStatusBadge(mission.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="past-missions" className="p-6">
              <h2 className="text-xl font-bold mb-4">Missions passées</h2>
              {pastMissions.length === 0 ? (
                <p className="text-gray-500">Aucune mission passée.</p>
              ) : (
                <div className="space-y-4">
                  {pastMissions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.start_date)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{mission.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.participants_count || 0}</span>
                          </div>
                          {getStatusBadge(mission.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog pour voir les participants */}
      <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Participants à la mission</DialogTitle>
            <DialogDescription>
              Liste des bénévoles inscrits à la mission "{selectedMission?.title}"
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {selectedMission?.participants?.map((participant: any) => (
              <Card key={participant.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.profile_picture_url} />
                        <AvatarFallback>
                          {participant.first_name?.[0]}{participant.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.first_name} {participant.last_name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{participant.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedMission && (
        <>
          <DeleteMissionDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            missionId={selectedMission}
            onSuccess={() => {
              // Rafraîchir les missions après la suppression
              window.location.reload();
            }}
          />
          <SuspendMissionDialog
            isOpen={isSuspendDialogOpen}
            onClose={() => setIsSuspendDialogOpen(false)}
            missionId={selectedMission}
            onSuccess={() => {
              // Rafraîchir les missions après la suspension
              window.location.reload();
            }}
          />
          <ShareMissionDialog
            isOpen={isShareDialogOpen}
            onClose={() => setIsShareDialogOpen(false)}
            missionId={selectedMission}
          />
          <MissionParticipantsDialog
            isOpen={isParticipantsDialogOpen}
            onClose={() => setIsParticipantsDialogOpen(false)}
            missionId={selectedMission}
          />
        </>
      )}
    </div>
  );
};

export default DashboardAssociation;
