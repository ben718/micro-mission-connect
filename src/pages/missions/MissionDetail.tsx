import { useParams, Link } from "react-router-dom";
import { useMission } from "@/hooks/useMissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Clock, Users, ArrowLeft, Heart, Share2 } from "lucide-react";
import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: mission, isLoading, error } = useMission(id);
  const { user, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-1" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Mission introuvable</h2>
          <p className="text-gray-500 mb-4">
            Nous n'avons pas pu trouver la mission que vous recherchez.
          </p>
          <Button asChild>
            <Link to="/missions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux missions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy à HH'h'mm", { locale: fr });
  };

  const getDurationText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return "1 heure";
    } else if (minutes % 60 === 0) {
      return `${minutes / 60} heures`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h${remainingMinutes}`;
    }
  };

  const handleParticipate = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour participer à cette mission");
      return;
    }

    if (profile?.is_association) {
      toast.error("Les associations ne peuvent pas participer aux missions");
      return;
    }

    if (mission.spots_taken >= mission.spots_available) {
      toast.error("Il n'y a plus de places disponibles pour cette mission");
      return;
    }

    try {
      const { error } = await supabase
        .from("mission_participants")
        .insert({
          mission_id: mission.id,
          user_id: user.id,
          status: "registered"
        });

      if (error) throw error;
      
      toast.success("Vous êtes inscrit à cette mission !");
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast.error("Une erreur est survenue lors de l'inscription");
    }
  };

  const handleCancelParticipation = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("mission_participants")
        .delete()
        .eq("mission_id", mission.id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      toast.success("Votre inscription a été annulée");
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error("Une erreur est survenue lors de l'annulation");
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <div className="container-custom py-10">
      <div className="mb-4">
        <Link to="/missions" className="text-bleu hover:underline flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux missions
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start flex-wrap mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{mission.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{mission.city}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(mission.starts_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Durée: {getDurationText(mission.duration_minutes)}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {mission.spots_taken}/{mission.spots_available} participants
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {mission.categories?.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{mission.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Compétences recherchées</h2>
              <div className="flex flex-wrap gap-2">
                {mission.skills_required?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Adresse</h2>
              <p className="text-gray-700">
                {mission.address ? (
                  <>
                    {mission.address}, {mission.postal_code} {mission.city}
                  </>
                ) : (
                  "Mission à distance"
                )}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-3">Association</h2>
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={mission.association?.avatar_url || ""} />
                  <AvatarFallback>
                    {getInitials(mission.association?.first_name, mission.association?.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {mission.association?.first_name} {mission.association?.last_name}
                  </div>
                </div>
              </div>
              {mission.association?.bio && (
                <p className="text-sm text-gray-600">{mission.association.bio}</p>
              )}
            </div>

            <div className="space-y-3">
              {user ? (
                mission.is_registered ? (
                  <>
                    <div className="p-3 bg-green-50 text-green-700 rounded-md mb-3">
                      Vous êtes inscrit à cette mission
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleCancelParticipation}
                    >
                      Annuler ma participation
                    </Button>
                  </>
                ) : profile?.is_association ? (
                  <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
                    Les associations ne peuvent pas participer aux missions
                  </div>
                ) : mission.spots_taken >= mission.spots_available ? (
                  <div className="p-3 bg-orange-50 text-orange-700 rounded-md">
                    Cette mission est complète
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-bleu hover:bg-bleu-700"
                    onClick={handleParticipate}
                  >
                    Je participe
                  </Button>
                )
              ) : (
                <Button 
                  className="w-full bg-bleu hover:bg-bleu-700"
                  asChild
                >
                  <Link to="/auth/login">Se connecter pour participer</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
