import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, User, Clock, CheckCircle2, Search } from "lucide-react";

const DashboardBenevole = () => {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMissions();
  }, [user]);

  const fetchMissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mission_participants")
      .select(`*, mission:mission_id(*, association:association_id(first_name, last_name))`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMissions(data || []);
    setLoading(false);
  };

  // Séparer missions à venir et passées
  const now = new Date();
  const missionsAVenir = missions.filter(
    (p) => p.mission && new Date(p.mission.starts_at) >= now && ["registered", "confirmed"].includes(p.status)
  );
  const missionsPassees = missions.filter(
    (p) => p.mission && (new Date(p.mission.starts_at) < now || p.status === "completed")
  );

  // Statistiques
  const nbMissions = missions.length;
  const nbMissionsPassees = missionsPassees.length;
  const nbMissionsAVenir = missionsAVenir.length;
  const heuresTotal = missionsPassees.reduce((acc, p) => acc + (p.mission?.duration_minutes || 0), 0) / 60;

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
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Acceptée</Badge>;
      case "refused":
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <CardTitle className="text-base font-semibold text-gray-500">Missions réalisées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{nbMissionsPassees}</span>
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

      {/* Prochaines missions */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Mes prochaines missions</h2>
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
            {missionsAVenir.map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link to={`/missions/${p.mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                        {p.mission.title}
                      </Link>
                      <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(p.mission.starts_at)}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{p.mission.city}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{p.mission.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(p.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Historique missions */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Historique de mes missions</h2>
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
            {missionsPassees.map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link to={`/missions/${p.mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                        {p.mission.title}
                      </Link>
                      <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(p.mission.starts_at)}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{p.mission.city}</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{p.mission.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(p.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardBenevole; 