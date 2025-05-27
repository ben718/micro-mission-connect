import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DeleteMissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
  onSuccess: () => void;
}

const DeleteMissionDialog: React.FC<DeleteMissionDialogProps> = ({
  isOpen,
  onClose,
  missionId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("missions")
        .delete()
        .eq("id", missionId);

      if (error) throw error;

      toast.success("Mission supprimée avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression de la mission:", error);
      toast.error("Erreur lors de la suppression de la mission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la mission</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMissionDialog; 