import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Users, Calendar, Globe } from "lucide-react";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  status: string;
  spots_available: number;
  spots_taken: number;
  participants: {
    id: string;
    first_name: string;
    last_name: string;
    status: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ProfileAssociation = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("missions");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Récupérer le profil
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Récupérer les missions
        const { data: missionsData, error: missionsError } = await supabase
          .from("missions")
          .select(`
            *,
            participants:mission_participants (
              id,
              status,
              user:profiles (
                first_name,
                last_name
              )
            )
          `)
          .eq("association_id", user.id)
          .order("created_at", { ascending: false });

        if (missionsError) throw missionsError;
        setMissions(missionsData.map((mission: any) => ({
          ...mission,
          participants: mission.participants.map((p: any) => ({
            id: p.id,
            first_name: p.user.first_name,
            last_name: p.user.last_name,
            status: p.status
          }))
        })));

        // Récupérer les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("mission_categories")
          .select(`
            categories (
              id,
              name,
              description,
              icon
            )
          `)
          .eq("mission_id", missionsData[0]?.id);

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData.map((c: any) => c.categories));

      } catch (error: any) {
        toast.error("Erreur lors du chargement du profil");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Profil non trouvé</h2>
      </div>
    );
  }

  const totalParticipants = missions.reduce(
    (acc, m) => acc + m.participants.length,
    0
  );

  const activeMissions = missions.filter(
    m => m.status === "open" || m.status === "filled"
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du profil */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-bleu/10 flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.first_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl text-bleu">
                {profile.first_name[0]}
              </span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.first_name}
            </h1>
            {profile.location && (
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </p>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bleu hover:underline flex items-center justify-center md:justify-start gap-2 mt-2"
              >
                <Globe className="w-4 h-4" />
                {profile.website}
              </a>
            )}
            {profile.association_description && (
              <p className="text-gray-600 mt-4">{profile.association_description}</p>
            )}
          </div>
          <Button variant="outline" className="text-bleu border-bleu">
            Éditer mon profil
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-bleu" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Missions actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeMissions}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-bleu" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bénévoles total</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalParticipants}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-bleu" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Missions créées</p>
              <p className="text-2xl font-bold text-gray-900">
                {missions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="missions">Mes missions</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="missions">
          <div className="grid gap-6">
            {missions.map(mission => (
              <Card key={mission.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {mission.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{mission.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge
                        variant={
                          mission.status === "completed"
                            ? "secondary"
                            : mission.status === "cancelled"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {mission.status === "completed"
                          ? "Complétée"
                          : mission.status === "cancelled"
                          ? "Annulée"
                          : mission.status === "filled"
                          ? "Complète"
                          : "En cours"}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {new Date(mission.starts_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {mission.spots_taken}/{mission.spots_available} places
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" className="text-bleu border-bleu">
                      Gérer les participants
                    </Button>
                  </div>
                </div>
                {mission.participants.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">Participants</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mission.participants.map(participant => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">
                            {participant.first_name} {participant.last_name}
                          </span>
                          <Badge
                            variant={
                              participant.status === "completed"
                                ? "secondary"
                                : participant.status === "cancelled"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {participant.status === "completed"
                              ? "Complété"
                              : participant.status === "cancelled"
                              ? "Annulé"
                              : "En cours"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Card key={category.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileAssociation; 