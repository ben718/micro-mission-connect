import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Calendar, MapPin, Star, User, Clock, CheckCircle2, Search, LogOut, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, profile, signOut } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchUserMissions();
    }
  }, [user]);

  const fetchUserMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("mission_participants")
        .select(`*, mission:mission_id(id, title, description, address, city, starts_at, duration_minutes, association:association_id(first_name, last_name))`)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setUserMissions(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          bio,
          phone,
          location
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Vous n'êtes pas connecté</h2>
          <p className="text-gray-500 mb-4">Connectez-vous pour accéder à votre profil.</p>
          <Button asChild>
            <a href="/auth/login">Se connecter</a>
          </Button>
        </div>
      </div>
    );
  }

  // Statistiques et badges
  const now = new Date();
  const missionsAVenir = userMissions.filter(
    (p) => p.mission && new Date(p.mission.starts_at) >= now && ["registered", "confirmed"].includes(p.status)
  );
  const missionsPassees = userMissions.filter(
    (p) => p.mission && (new Date(p.mission.starts_at) < now || p.status === "completed")
  );
  const nbMissionsPassees = missionsPassees.length;
  const nbMissionsAVenir = missionsAVenir.length;
  const heuresTotal = missionsPassees.reduce((acc, p) => acc + (p.mission?.duration_minutes || 0), 0) / 60;
  const associationsAidees = new Set(missionsPassees.map(p => p.mission?.association?.first_name + p.mission?.association?.last_name)).size;
  const badges = [];
  if (nbMissionsPassees >= 1) badges.push({ label: "Nouveau bénévole", icon: <Star className="w-4 h-4 mr-1" /> });
  if (nbMissionsPassees >= 5) badges.push({ label: "Engagé", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> });
  if (heuresTotal >= 20) badges.push({ label: "Super bénévole", icon: <User className="w-4 h-4 mr-1" /> });

  // Complétion du profil
  const champs = [firstName, lastName, bio, phone, location];
  const completion = Math.round((champs.filter(Boolean).length / champs.length) * 100);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="container-custom py-10">
      {/* En-tête profil */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="text-2xl">
              {getInitials(profile?.first_name, profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1">{profile?.first_name} {profile?.last_name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-100 text-green-800">Bénévole actif</Badge>
              {badges.length > 0 && badges.map((b, i) => (
                <Badge key={i} className="flex items-center gap-1 bg-bleu/10 text-bleu font-medium">{b.icon}{b.label}</Badge>
              ))}
            </div>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-4">
              <div className="h-2 bg-bleu rounded-full" style={{ width: `${completion}%` }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Profil complété à {completion}%</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3">
            <Link to="/missions">
              <Search className="w-5 h-5 mr-2" />
              Trouver une mission
            </Link>
          </Button>
          <Button variant="outline" onClick={signOut} className="mt-2">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
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
            <User className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Assos aidées</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{associationsAidees}</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs profil/mes missions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-xl">
                  {getInitials(profile?.first_name, profile?.last_name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle>
                {profile?.first_name} {profile?.last_name}
              </CardTitle>
              <div className="text-sm text-gray-500">{user.email}</div>
              <TabsList className="w-full mt-4">
                <TabsTrigger
                  value="profile"
                  className="w-full"
                  onClick={() => setTab("profile")}
                >
                  Profil
                </TabsTrigger>
                <TabsTrigger
                  value="missions"
                  className="w-full"
                  onClick={() => setTab("missions")}
                >
                  Missions
                </TabsTrigger>
              </TabsList>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-3">
          {tab === "profile" ? (
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ville</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="bg-bleu hover:bg-bleu-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Mes missions</CardTitle>
              </CardHeader>
              <CardContent>
                {userMissions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      Vous n'êtes inscrit à aucune mission pour le moment.
                    </p>
                    <Button className="mt-4 bg-bleu hover:bg-bleu-700" asChild>
                      <a href="/missions">Trouver une mission</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userMissions.map((participation) => (
                      <Card key={participation.id}>
                        <CardContent>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                <a
                                  href={`/missions/${participation.mission.id}`}
                                  className="text-bleu hover:underline"
                                >
                                  {participation.mission.title}
                                </a>
                              </h3>
                              <p className="text-sm text-gray-500">
                                {participation.mission.association.first_name} {participation.mission.association.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(participation.mission.starts_at)} - {participation.mission.city}
                              </p>
                            </div>
                            <div>
                              {participation.status === "registered" && (
                                <Badge className="bg-green-100 text-green-800">Inscrit</Badge>
                              )}
                              {participation.status === "confirmed" && (
                                <Badge className="bg-blue-100 text-blue-800">Confirmé</Badge>
                              )}
                              {participation.status === "completed" && (
                                <Badge className="bg-purple-100 text-purple-800">Terminé</Badge>
                              )}
                              {participation.status === "cancelled" && (
                                <Badge className="bg-red-100 text-red-800">Annulé</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
