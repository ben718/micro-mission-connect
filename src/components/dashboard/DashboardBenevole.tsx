
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, User, Clock, CheckCircle2, Search } from "lucide-react";
import { useUserMissions, useMissionStats } from "@/hooks/useMissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DashboardBenevole = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Utiliser les hooks personnalisés pour récupérer les données
  const { data: missions, isLoading: missionsLoading } = useUserMissions(user?.id);
  const { data: stats, isLoading: statsLoading } = useMissionStats(user?.id, false);
  
  useEffect(() => {
    if (!missionsLoading && !statsLoading) {
      setLoading(false);
    }
  }, [missionsLoading, statsLoading]);

  // Séparer missions à venir et passées
  const now = new Date();
  const missionsAVenir = missions?.filter(
    (m) => new Date(m.starts_at) >= now && ["registered", "confirmed"].includes(m.participant_status || '')
  ) || [];
  const missionsPassees = missions?.filter(
    (m) => new Date(m.starts_at) < now || m.participant_status === "completed"
  ) || [];

  // Statistiques
  const nbMissions = missions?.length || 0;
  const nbMissionsPassees = missionsPassees?.length || 0;
  const nbMissionsAVenir = missionsAVenir?.length || 0;
  const heuresTotal = stats?.totalHours || 0;

  // Badges simples
  const badges = [];
  if (nbMissionsPassees >= 1) badges.push({ label: "Nouveau bénévole", icon: <Star className="w-4 h-4 mr-1" /> });
  if (nbMissionsPassees >= 5) badges.push({ label: "Engagé", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> });
  if (heuresTotal >= 20) badges.push({ label: "Super bénévole", icon: <User className="w-4 h-4 mr-1" /> });

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE d MMMM à HH'h'mm", { locale: fr });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Inscrit</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Validé</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      case "no_show":
        return <Badge className="bg-red-100 text-red-800">Absence</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getIcon = (missionType: string | undefined) => {
    // Logique pour retourner l'icône appropriée selon le type de mission
    return <Calendar className="h-4 w-4 text-bleu" />;
  };

  return (
    <div className="container-custom py-10">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="text-2xl">
              {getInitials(profile?.first_name, profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1">Bonjour {profile?.first_name || user?.email} !</h1>
            <p className="text-gray-600">Bienvenue sur votre espace bénévole</p>
            {(!profile?.first_name || !profile?.last_name) && (
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link to="/profile">Compléter mon profil</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3">
            <Link to="/missions">
              <Search className="w-5 h-5 mr-2" />
              Trouver une mission
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{nbMissionsAVenir}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle2 className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Missions validées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">
              {missions?.filter(m => m.participant_status === "completed").length || 0}
            </span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Heures bénévolat</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{Math.round(heuresTotal)}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Star className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {badges.length === 0 ? (
              <span className="text-gray-400">Aucun badge</span>
            ) : (
              badges.map((b, i) => (
                <Badge key={i} className="flex items-center gap-1 bg-bleu/10 text-bleu font-medium">
                  {b.icon}
                  {b.label}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour les missions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Missions à venir ({nbMissionsAVenir})</TabsTrigger>
          <TabsTrigger value="past">Historique ({nbMissionsPassees})</TabsTrigger>
        </TabsList>

        {/* Missions à venir */}
        <TabsContent value="upcoming">
          {loading ? (
            <p>Chargement…</p>
          ) : nbMissionsAVenir === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas de missions à venir.</p>
              <Button asChild>
                <Link to="/missions">Trouver une mission</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missionsAVenir.map((m) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-bleu/10 flex items-center justify-center mr-2">
                            {getIcon(m.category)}
                          </div>
                          <Link to={`/missions/${m.id}`} className="font-medium text-lg text-bleu hover:underline">
                            {m.title}
                          </Link>
                        </div>
                        <div className="flex flex-col space-y-1.5 text-gray-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(m.starts_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{m.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Durée: {m.duration}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{m.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={m.association?.avatar_url || ""} />
                              <AvatarFallback className="text-xs">
                                {m.association?.first_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              Par {m.association?.first_name}
                            </span>
                          </div>
                          {getStatusBadge(m.participant_status || 'registered')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Historique missions */}
        <TabsContent value="past">
          {loading ? (
            <p>Chargement…</p>
          ) : nbMissionsPassees === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore réalisé de mission.</p>
              <Button asChild>
                <Link to="/missions">Trouver une mission</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missionsPassees.map((m) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-bleu/10 flex items-center justify-center mr-2">
                            {getIcon(m.category)}
                          </div>
                          <Link to={`/missions/${m.id}`} className="font-medium text-lg text-bleu hover:underline">
                            {m.title}
                          </Link>
                        </div>
                        <div className="flex flex-col space-y-1.5 text-gray-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(m.starts_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{m.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Durée: {m.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={m.association?.avatar_url || ""} />
                              <AvatarFallback className="text-xs">
                                {m.association?.first_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              Par {m.association?.first_name}
                            </span>
                          </div>
                          {getStatusBadge(m.participant_status || 'completed')}
                        </div>
                      </div>
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
