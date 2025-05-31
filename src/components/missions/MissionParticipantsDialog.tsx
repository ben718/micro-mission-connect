
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
  status: "inscrit" | "confirmé" | "annulé" | "terminé";
  created_at: string;
}

interface MissionParticipantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
}

const MissionParticipantsDialog: React.FC<MissionParticipantsDialogProps> = ({
  isOpen,
  onClose,
  missionId,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [participants, setParticipants] = React.useState<Participant[]>([]);

  React.useEffect(() => {
    if (isOpen && missionId) {
      fetchParticipants();
    }
  }, [isOpen, missionId]);

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from("mission_registrations")
        .select(`
          id,
          status,
          created_at,
          user_id
        `)
        .eq("mission_id", missionId);

      if (error) throw error;

      if (data && data.length > 0) {
        // Get user profiles separately
        const userIds = data.map(reg => reg.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, profile_picture_url")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        const formattedParticipants = data.map((registration) => {
          const profile = profiles?.find(p => p.id === registration.user_id);
          return {
            id: registration.user_id,
            first_name: profile?.first_name || "Utilisateur",
            last_name: profile?.last_name || "",
            profile_picture_url: profile?.profile_picture_url,
            status: registration.status as "inscrit" | "confirmé" | "annulé" | "terminé",
            created_at: registration.created_at,
          };
        });

        setParticipants(formattedParticipants);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des participants:", error);
      toast.error("Erreur lors de la récupération des participants");
      setParticipants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inscrit":
        return <Badge variant="outline">En attente</Badge>;
      case "confirmé":
        return <Badge variant="default">Confirmé</Badge>;
      case "terminé":
        return <Badge variant="secondary">Terminé</Badge>;
      case "annulé":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Participants de la mission</DialogTitle>
          <DialogDescription>
            Liste des bénévoles inscrits à cette mission
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Chargement des participants...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p>Aucun participant pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={participant.profile_picture_url || undefined} />
                      <AvatarFallback>
                        {participant.first_name[0]}{participant.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.first_name} {participant.last_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Inscrit le {new Date(participant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(participant.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MissionParticipantsDialog;
