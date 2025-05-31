import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserMissions } from "@/hooks/useMissions";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, User, Clock, CheckCircle2, Search, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DashboardBenevole = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { data: userMissions, isLoading } = useUserMissions(user?.id);
  const { unreadCount } = useNotifications(user?.id);
  
  // Séparer les missions à venir et passées
  const now = new Date();
  const upcomingMissions = userMissions?.filter(m => 
    new Date(m.mission.start_date) >= now && 
    ['inscrit', 'confirmé'].includes(m.status)
  ) || [];
  
  const pastMissions = userMissions?.filter(m => 
    new Date(m.mission.start_date) < now || 
    ['terminé', 'annulé'].includes(m.status)
  ) || [];

  // Statistiques calculées dynamiquement
  const totalMissions = userMissions?.length || 0;
  const completedMissions = userMissions?.filter(m => m.status === 'terminé').length || 0;
  const upcomingMissionsCount = upcomingMissions.length;
  
  // Calcul des heures totales basé sur les missions terminées
  const totalHours = userMissions?.filter(m => m.status === 'terminé')
    .reduce((acc, m) => acc + (m.mission.duration_minutes || 0) / 60, 0) || 0;

  // Badges dynamiques basés sur les vraies statistiques
  const badges = [];
  if (completedMissions >= 1) {
    badges.push({ 
      label: "Nouveau bénévole", 
      icon: <Star className="w-4 h-4 mr-1" />,
      color: "bg-blue-100 text-blue-800"
    });
  }
  if (completedMissions >= 5) {
    badges.push({ 
      label: "Bénévole engagé", 
      icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
      color: "bg-green-100 text-green-800"
    });
  }
  if (totalHours >= 20) {
    badges.push({ 
      label: "Super bénévole", 
      icon: <User className="w-4 h-4 mr-1" />,
      color: "bg-purple-100 text-purple-800"
    });
  }
  if (completedMissions >= 10) {
    badges.push({ 
      label: "Bénévole expert", 
      icon: <Star className="w-4 h-4 mr-1" />,
      color: "bg-yellow-100 text-yellow-800"
    });
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <div className="container-custom py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.profile_picture_url || ""} />
            <AvatarFallback className="text-2xl">
              {getInitials(profile?.first_name, profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1">Bonjour {profile?.first_name || user?.email} !</h1>
            <p className="text-gray-600">Bienvenue dans votre espace bénévole</p>
            {(!profile?.first_name || !profile?.last_name) && (
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link to="/profile">Compléter mon profil</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button asChild variant="outline" size="sm">
                <Link to="/notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''}
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link to="/associations" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Mes associations
              </Link>
            </Button>
          </div>
          <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3">
            <Link to="/missions">
              <Search className="w-5 h-5 mr-2" />
              Trouver une mission
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{upcomingMissionsCount}</span>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle2 className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{completedMissions}</span>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Heures de bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{Math.round(totalHours * 10) / 10}</span>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Star className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1">
            {badges.length === 0 ? (
              <span className="text-gray-400 text-sm">Aucun badge</span>
            ) : (
              badges.slice(0, 2).map((badge, i) => (
                <Badge key={i} className={`flex items-center gap-1 text-xs ${badge.color}`}>
                  {badge.icon}
                  {badge.label}
                </Badge>
              ))
            )}
            {badges.length > 2 && (
              <span className="text-xs text-gray-500">+{badges.length - 2}</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mission tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Missions à venir ({upcomingMissionsCount})</TabsTrigger>
          <TabsTrigger value="past">Historique ({pastMissions.length})</TabsTrigger>
        </TabsList>

        {/* Upcoming missions */}
        <TabsContent value="upcoming">
          {isLoading ? (
            <p>Chargement…</p>
          ) : upcomingMissionsCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas de missions à venir.</p>
              <Button asChild>
                <Link to="/missions">Trouver une mission</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingMissions.map((registration) => (
                <Card key={registration.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link to={`/missions/${registration.mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                      {registration.mission.title}
                    </Link>
                    <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{format(new Date(registration.mission.start_date), 'PPP', { locale: fr })}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{registration.mission.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{registration.mission.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{registration.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Mission history */}
        <TabsContent value="past">
          {isLoading ? (
            <p>Chargement…</p>
          ) : pastMissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore terminé de missions.</p>
              <Button asChild>
                <Link to="/missions">Trouver une mission</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastMissions.map((registration) => (
                <Card key={registration.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link to={`/missions/${registration.mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                      {registration.mission.title}
                    </Link>
                    <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{format(new Date(registration.mission.start_date), 'PPP', { locale: fr })}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{registration.mission.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{registration.mission.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{registration.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBenevole;
