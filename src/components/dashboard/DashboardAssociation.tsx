
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { useOrganizationMissions } from "@/hooks/useMissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, Users, Clock, Calendar, MapPin, BarChart2, MoreVertical, 
  Edit, Trash2, Share2, Eye, Pause, Building2, Target, Award, 
  Heart, Star, TrendingUp, AlertCircle 
} from "lucide-react";
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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DeleteMissionDialog from "@/components/missions/DeleteMissionDialog";
import SuspendMissionDialog from "@/components/missions/SuspendMissionDialog";
import ShareMissionDialog from "@/components/missions/ShareMissionDialog";
import MissionParticipantsDialog from "@/components/missions/MissionParticipantsDialog";
import EditMissionDialog from "@/components/missions/EditMissionDialog";

const DashboardAssociation = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const { data: missions, isLoading, error } = useOrganizationMissions(organizationProfile?.id);
  const [activeTab, setActiveTab] = useState("missions");
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [stats, setStats] = useState({
    totalBenevoles: 0,
    totalHeures: 0,
    tauxCompletion: 0,
    impactSocial: 0,
    satisfactionBenevoles: 0,
    missionsUrgentes: 0
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
      let urgentMissions = 0;

      for (const mission of missions) {
        const { data: registrations } = await supabase
          .from("mission_registrations")
          .select("user_id, volunteer_rating")
          .eq("mission_id", mission.id);

        registrations?.forEach(reg => {
          uniqueVolunteers.add(reg.user_id);
          if (reg.volunteer_rating) {
            totalMinutes += (mission.duration_minutes || 0);
          }
        });

        // Compter les missions urgentes (moins de 7 jours)
        const daysUntilStart = Math.ceil((new Date(mission.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilStart <= 7 && mission.status === "active") {
          urgentMissions++;
        }
      }

      const totalHours = Math.round(totalMinutes / 60);
      const totalMissions = missions.length;
      const completedMissions = missions.filter(m => m.status === "completed").length;
      const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

      // Calculer l'impact social (basé sur le nombre de bénévoles et d'heures)
      const impactSocial = Math.round((uniqueVolunteers.size * totalHours) / 100);

      // Calculer la satisfaction moyenne des bénévoles
      const { data: feedbacks } = await supabase
        .from("mission_registrations")
        .select("volunteer_rating")
        .not("volunteer_rating", "is", null);

      const satisfactionMoyenne = feedbacks?.length 
        ? Math.round(feedbacks.reduce((acc, curr) => acc + (curr.volunteer_rating || 0), 0) / feedbacks.length)
        : 0;

      setStats({
        totalBenevoles: uniqueVolunteers.size,
        totalHeures: totalHours,
        tauxCompletion: completionRate,
        impactSocial,
        satisfactionBenevoles: satisfactionMoyenne,
        missionsUrgentes: urgentMissions
      });
    } catch (err) {
      console.error("Erreur lors du calcul des statistiques:", err);
    }
  };

  const handleMissionAction = (action: string, missionId: string) => {
    setSelectedMission(missionId);
    switch (action) {
      case "view-participants":
        setIsParticipantsDialogOpen(true);
        break;
      case "share":
        setIsShareDialogOpen(true);
        break;
      case "suspend":
        setIsSuspendDialogOpen(true);
        break;
      case "delete":
        setIsDeleteDialogOpen(true);
        break;
      case "edit":
        setIsEditDialogOpen(true);
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
            <p className="text-gray-600">Bienvenue sur votre espace association !</p>
            {organizationProfile.address && (
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-bleu" />
                <span>{organizationProfile.address}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3 shadow-sm">
            <Link to="/missions/new">
              <Plus className="w-5 h-5 mr-2" />
              Créer une mission
            </Link>
          </Button>
          <Button variant="outline" className="text-lg px-6 py-3">
            <Building2 className="w-5 h-5 mr-2" />
            Gérer l'association
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-sm font-semibold text-gray-500">Missions créées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-bleu">{missions?.length || 0}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="w-6 h-6 text-bleu" />
            <CardTitle className="text-sm font-semibold text-gray-500">Bénévoles engagés</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-bleu">{stats.totalBenevoles}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-sm font-semibold text-gray-500">Heures de bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-bleu">{stats.totalHeures}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Target className="w-6 h-6 text-bleu" />
            <CardTitle className="text-sm font-semibold text-gray-500">Impact social</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-bleu">{stats.impactSocial}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Star className="w-6 h-6 text-bleu" />
            <CardTitle className="text-sm font-semibold text-gray-500">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-bleu">{stats.satisfactionBenevoles}/5</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertCircle className="w-6 h-6 text-bleu" />
            <CardTitle className="text-sm font-semibold text-gray-500">Missions urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-bleu">{stats.missionsUrgentes}</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bleu/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-bleu" />
              </div>
              <div>
                <h3 className="font-semibold">Missions populaires</h3>
                <p className="text-sm text-gray-500">Voir les missions les plus demandées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bleu/10 rounded-lg">
                <Heart className="w-6 h-6 text-bleu" />
              </div>
              <div>
                <h3 className="font-semibold">Bénévoles fidèles</h3>
                <p className="text-sm text-gray-500">Découvrir vos bénévoles réguliers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bleu/10 rounded-lg">
                <Award className="w-6 h-6 text-bleu" />
              </div>
              <div>
                <h3 className="font-semibold">Impact social</h3>
                <p className="text-sm text-gray-500">Mesurer votre impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bleu/10 rounded-lg">
                <Users className="w-6 h-6 text-bleu" />
              </div>
              <div>
                <h3 className="font-semibold">Recrutement</h3>
                <p className="text-sm text-gray-500">Trouver de nouveaux bénévoles</p>
              </div>
            </div>
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
                              <DropdownMenuItem onClick={() => handleMissionAction('edit', mission.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMissionAction('view-participants', mission.id)}>
                                <Users className="w-4 h-4 mr-2" />
                                Voir les participants
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMissionAction('share', mission.id)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Partager
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMissionAction('suspend', mission.id)}>
                                <Pause className="w-4 h-4 mr-2" />
                                Suspendre
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleMissionAction('delete', mission.id)}
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
              Liste des bénévoles inscrits à cette mission
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <p className="text-center text-muted-foreground">
              Utilisez le dialogue dédié pour voir les participants.
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteMissionDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        missionId={selectedMission || ""}
        onSuccess={() => {
          // Rafraîchir les missions après la suppression
          window.location.reload();
        }}
      />

      <SuspendMissionDialog
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        missionId={selectedMission || ""}
        missionTitle={missions?.find(m => m.id === selectedMission)?.title || "Mission"}
        onSuccess={() => {
          // Rafraîchir les missions après la suspension
          window.location.reload();
        }}
      />

      <ShareMissionDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        missionId={selectedMission || ""}
      />

      <MissionParticipantsDialog
        isOpen={isParticipantsDialogOpen}
        onClose={() => setIsParticipantsDialogOpen(false)}
        missionId={selectedMission || ""}
      />

      <EditMissionDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        missionId={selectedMission || ""}
        onSuccess={() => {
          // Rafraîchir les missions après la mise à jour
          window.location.reload();
        }}
      />
    </div>
  );
};

export default DashboardAssociation;
