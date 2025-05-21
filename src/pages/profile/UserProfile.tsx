
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
import { MissionParticipant } from "@/types/mission";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {
  const { user, profile } = useAuth();
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
        .select(`
          *,
          mission:mission_id(
            id,
            title,
            description,
            address,
            city,
            starts_at,
            association:association_id(first_name, last_name)
          )
        `)
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

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy à HH'h'mm", { locale: fr });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Inscrit</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Confirmé</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Terminé</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container-custom py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
      </div>

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
            </CardHeader>
            <CardContent>
              <TabsList className="w-full">
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
            </CardContent>
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
                        <CardContent className="p-4">
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
                                {participation.mission.association.first_name}{" "}
                                {participation.mission.association.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(participation.mission.starts_at)} - {participation.mission.city}
                              </p>
                            </div>
                            <div>{getStatusBadge(participation.status)}</div>
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
