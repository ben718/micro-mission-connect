
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMissionDetails } from "@/hooks/useMissionDetails";
import { Check, X, Clock, User, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const { mission, validateParticipation, isLoading } = useMissionDetails(missionId);
  const [reviewTexts, setReviewTexts] = useState<{[key: string]: string}>({});
  const [isSubmittingReview, setIsSubmittingReview] = useState<{[key: string]: boolean}>({});

  if (isLoading || !mission) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participants de la mission</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Chargement...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const registrations = mission.mission_registrations || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inscrit':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'confirmé':
        return <Badge variant="default"><Check className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'terminé':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'annulé':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Annulé</Badge>;
      case 'no_show':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Absent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleValidation = (registrationId: string, status: string, userId: string) => {
    if (validateParticipation) {
      validateParticipation.mutate({ registrationId, status, userId });
    }
  };

  const handleSubmitReview = async (userId: string, registrationId: string) => {
    const reviewText = reviewTexts[registrationId];
    if (!reviewText?.trim()) {
      toast.error("Veuillez saisir un commentaire");
      return;
    }

    setIsSubmittingReview(prev => ({ ...prev, [registrationId]: true }));

    try {
      const { error } = await supabase
        .from('volunteer_reviews')
        .insert({
          volunteer_id: userId,
          mission_id: missionId,
          organization_id: mission.organization_id,
          rating: 5, // Rating par défaut, pourrait être ajusté
          comment: reviewText.trim(),
          is_public: true
        });

      if (error) throw error;

      toast.success("Commentaire ajouté avec succès");
      setReviewTexts(prev => ({ ...prev, [registrationId]: '' }));
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmittingReview(prev => ({ ...prev, [registrationId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Participants de la mission</DialogTitle>
          <DialogDescription>
            Gérez les participants et leur statut pour cette mission
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {registrations.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground">
                Aucun participant inscrit pour cette mission.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration: any) => (
                <Card key={registration.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link 
                              to={`/profile/volunteer/${registration.user_id}`}
                              className="font-medium hover:underline text-blue-600"
                            >
                              {registration.user?.first_name || 'Utilisateur'} {registration.user?.last_name || ''}
                            </Link>
                            {getStatusBadge(registration.status)}
                          </div>
                          <p className="text-sm text-gray-600">{registration.user?.email}</p>
                          <p className="text-xs text-gray-500">
                            Inscrit le {new Date(registration.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions de validation */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidation(registration.id, 'confirmé', registration.user_id)}
                        disabled={registration.status === 'confirmé'}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidation(registration.id, 'terminé', registration.user_id)}
                        disabled={registration.status === 'terminé'}
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      >
                        Marquer terminé
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidation(registration.id, 'no_show', registration.user_id)}
                        disabled={registration.status === 'no_show'}
                        className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                      >
                        Marquer absent
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleValidation(registration.id, 'annulé', registration.user_id)}
                        disabled={registration.status === 'annulé'}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                    </div>

                    {/* Zone de commentaire pour les missions terminées */}
                    {registration.status === 'terminé' && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Laisser un commentaire public</span>
                        </div>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Décrivez l'expérience avec ce bénévole..."
                            value={reviewTexts[registration.id] || ''}
                            onChange={(e) => setReviewTexts(prev => ({ 
                              ...prev, 
                              [registration.id]: e.target.value 
                            }))}
                            rows={3}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReview(registration.user_id, registration.id)}
                            disabled={isSubmittingReview[registration.id] || !reviewTexts[registration.id]?.trim()}
                          >
                            {isSubmittingReview[registration.id] ? 'Envoi...' : 'Publier le commentaire'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionParticipantsDialog;
