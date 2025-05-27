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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SuspendMissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
  onSuccess: () => void;
}

const SuspendMissionDialog: React.FC<SuspendMissionDialogProps> = ({
  isOpen,
  onClose,
  missionId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const handleSuspend = async () => {
    if (!reason.trim()) {
      toast.error("Veuillez fournir une raison pour la suspension");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("missions")
        .update({
          status: "suspended",
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
        })
        .eq("id", missionId);

      if (error) throw error;

      toast.success("Mission suspendue avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suspension de la mission:", error);
      toast.error("Erreur lors de la suspension de la mission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspendre la mission</DialogTitle>
          <DialogDescription>
            Veuillez fournir une raison pour la suspension de cette mission.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison de la suspension</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez pourquoi vous suspendez cette mission..."
              required
            />
          </div>
        </div>
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
            onClick={handleSuspend}
            disabled={isLoading}
          >
            {isLoading ? "Suspension..." : "Suspendre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendMissionDialog; 