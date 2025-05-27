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
  full_name: string;
  avatar_url: string | null;
  email: string;
  status: "pending" | "approved" | "rejected";
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
    if (isOpen) {
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
          user_id,
          profiles!mission_registrations_user_id_fkey (
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("mission_id", missionId);

      if (error) throw error;

      const formattedParticipants = data.map((registration) => ({
        id: registration.profiles.id,
        full_name: registration.profiles.full_name,
        avatar_url: registration.profiles.avatar_url,
        email: registration.profiles.email,
        status: registration.status as "pending" | "approved" | "rejected",
        created_at: registration.created_at,
      }));

      setParticipants(formattedParticipants);
    } catch (error) {
      console.error("Erreur lors de la récupération des participants:", error);
      toast.error("Erreur lors de la récupération des participants");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      case "approved":
        return <Badge variant="default">Approuvé</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return null;
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
                      <AvatarImage src={participant.avatar_url || undefined} />
                      <AvatarFallback>
                        {participant.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(participant.status)}
                    <p className="text-sm text-muted-foreground">
                      Inscrit le {new Date(participant.created_at).toLocaleDateString()}
                    </p>
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