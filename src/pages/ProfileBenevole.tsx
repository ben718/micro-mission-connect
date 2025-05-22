import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Clock, Award, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  status: string;
  association: {
    first_name: string;
    last_name: string;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  awarded_at: string;
}

const ProfileBenevole = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
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
          .from("mission_participants")
          .select(`
            mission_id,
            status,
            missions (
              id,
              title,
              description,
              starts_at,
              ends_at,
              association:profiles!missions_association_id_fkey (
                first_name,
                last_name
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (missionsError) throw missionsError;
        setMissions(missionsData.map((mp: any) => ({
          ...mp.missions,
          status: mp.status,
          association: mp.missions.association
        })));

        // Récupérer les badges
        const { data: badgesData, error: badgesError } = await supabase
          .from("user_badges")
          .select(`
            awarded_at,
            badges (
              id,
              name,
              description,
              icon
            )
          `)
          .eq("user_id", user.id)
          .order("awarded_at", { ascending: false });

        if (badgesError) throw badgesError;
        setBadges(badgesData.map((ub: any) => ({
          ...ub.badges,
          awarded_at: ub.awarded_at
        })));

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

  const totalHours = missions
    .filter(m => m.status === "completed")
    .reduce((acc, m) => {
      const start = new Date(m.starts_at);
      const end = new Date(m.ends_at);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du profil */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-bleu/10 flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl text-bleu">
                {profile.first_name[0]}{profile.last_name[0]}
              </span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.first_name} {profile.last_name}
            </h1>
            {profile.location && (
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </p>
            )}
            {profile.bio && (
              <p className="text-gray-600 mt-4">{profile.bio}</p>
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
              <p className="text-sm text-gray-600">Missions complétées</p>
              <p className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === "completed").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-bleu" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Heures de bénévolat</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(totalHours)}h
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-bleu" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Badges obtenus</p>
              <p className="text-2xl font-bold text-gray-900">
                {badges.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="missions">Mes missions</TabsTrigger>
          <TabsTrigger value="badges">Mes badges</TabsTrigger>
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
                          : "En cours"}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {new Date(mission.starts_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Pour {mission.association.first_name} {mission.association.last_name}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map(badge => (
              <Card key={badge.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bleu/10 flex items-center justify-center">
                    <span className="text-2xl">{badge.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Obtenu le {new Date(badge.awarded_at).toLocaleDateString()}
                    </p>
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

export default ProfileBenevole;
