import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useMissionActions } from '@/hooks/useMissions';
import { ParticipationStatus } from '@/types/mission';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Award, MessageSquare } from 'lucide-react';

interface ParticipantValidationProps {
  missionId: string;
  participants: Array<{
    id: string;
    status: ParticipationStatus;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url: string | null;
    };
  }>;
  onValidationComplete?: () => void;
  availableBadges?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export default function ParticipantValidation({ 
  missionId, 
  participants, 
  onValidationComplete,
  availableBadges = []
}: ParticipantValidationProps) {
  const { validateParticipation } = useMissionActions();
  const [selectedBadges, setSelectedBadges] = useState<Record<string, string[]>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [validatedParticipants, setValidatedParticipants] = useState<Record<string, boolean>>({});
  
  // Filtrer les participants qui n'ont pas encore été validés
  const validatableParticipants = participants.filter(
    p => ['registered', 'confirmed'].includes(p.status)
  );
  
  // Participants déjà validés ou absents
  const processedParticipants = participants.filter(
    p => ['completed', 'no_show', 'cancelled'].includes(p.status)
  );
  
  const handleBadgeToggle = (participantId: string, badgeName: string) => {
    setSelectedBadges(prev => {
      const current = prev[participantId] || [];
      if (current.includes(badgeName)) {
        return {
          ...prev,
          [participantId]: current.filter(b => b !== badgeName)
        };
      } else {
        return {
          ...prev,
          [participantId]: [...current, badgeName]
        };
      }
    });
  };
  
  const handleValidateParticipant = async (participantId: string, present: boolean) => {
    setIsSubmitting(prev => ({ ...prev, [participantId]: true }));
    
    try {
      const result = await validateParticipation(
        participantId, 
        present, 
        feedbacks[participantId], 
        present ? (selectedBadges[participantId] || []) : undefined
      );
      
      if (result.success) {
        toast.success(`Participant ${present ? 'validé' : 'marqué absent'} avec succès`);
        setValidatedParticipants(prev => ({ ...prev, [participantId]: true }));
        if (onValidationComplete) onValidationComplete();
      } else {
        toast.error(`Erreur lors de la validation: ${result.error}`);
      }
    } catch (error) {
      console.error("Erreur de validation:", error);
      toast.error("Une erreur est survenue lors de la validation");
    } finally {
      setIsSubmitting(prev => ({ ...prev, [participantId]: false }));
    }
  };
  
  const toggleFeedback = (participantId: string) => {
    setShowFeedback(prev => ({
      ...prev,
      [participantId]: !prev[participantId]
    }));
  };
  
  // Si tous les participants ont été traités
  if (validatableParticipants.length === 0 && processedParticipants.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-gray-600">Aucun participant à valider pour cette mission.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Participants à valider */}
      {validatableParticipants.length > 0 && (
        <>
          <h3 className="text-lg font-medium">Participants à valider ({validatableParticipants.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {validatableParticipants.map(participant => (
              <Card key={participant.id} className={validatedParticipants[participant.id] ? "opacity-50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={participant.user.avatar_url || ""} />
                      <AvatarFallback>
                        {participant.user.first_name?.[0]}{participant.user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {participant.user.first_name} {participant.user.last_name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {participant.status === 'registered' ? 'Inscrit' : 
                       participant.status === 'confirmed' ? 'Confirmé' : participant.status}
                    </Badge>
                  </div>
                  
                  {/* Affichage du feedback si visible */}
                  {showFeedback[participant.id] && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">
                        Feedback (optionnel):
                      </label>
                      <Textarea
                        value={feedbacks[participant.id] || ''}
                        onChange={(e) => setFeedbacks(prev => ({
                          ...prev, 
                          [participant.id]: e.target.value
                        }))}
                        placeholder="Commentaire sur la participation..."
                        className="w-full"
                      />
                      
                      {availableBadges.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Badges à attribuer:
                          </label>
                          <div className="space-y-2">
                            {availableBadges.map(badge => (
                              <div key={badge.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`badge-${participant.id}-${badge.id}`}
                                  checked={(selectedBadges[participant.id] || []).includes(badge.name)}
                                  onCheckedChange={() => handleBadgeToggle(participant.id, badge.name)}
                                />
                                <label
                                  htmlFor={`badge-${participant.id}-${badge.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {badge.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeedback(participant.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {showFeedback[participant.id] ? 'Masquer' : 'Feedback'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={isSubmitting[participant.id] || validatedParticipants[participant.id]}
                    onClick={() => handleValidateParticipant(participant.id, false)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isSubmitting[participant.id] || validatedParticipants[participant.id]} 
                    onClick={() => handleValidateParticipant(participant.id, true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Présent
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
      
      {/* Participants déjà traités */}
      {processedParticipants.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-8">Validations terminées ({processedParticipants.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {processedParticipants.map(participant => (
              <Card key={participant.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={participant.user.avatar_url || ""} />
                      <AvatarFallback>
                        {participant.user.first_name?.[0]}{participant.user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {participant.user.first_name} {participant.user.last_name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      participant.status === 'completed' ? 'default' : 
                      participant.status === 'cancelled' ? 'destructive' : 
                      'outline'
                    }
                  >
                    {participant.status === 'completed' ? 'Validé' : 
                     participant.status === 'no_show' ? 'Absent' : 
                     participant.status === 'cancelled' ? 'Annulé' : 
                     participant.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
