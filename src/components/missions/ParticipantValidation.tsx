
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMissionDetails } from '@/hooks/useMissionDetails';
import { Check, X, Clock } from 'lucide-react';

interface ParticipantValidationProps {
  missionId: string;
}

const ParticipantValidation: React.FC<ParticipantValidationProps> = ({ missionId }) => {
  const { mission, validateParticipation, isLoading } = useMissionDetails(missionId);

  if (isLoading || !mission) {
    return <div>Chargement...</div>;
  }

  const registrations = mission.mission_registrations || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inscrit':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'confirmé':
        return <Badge variant="default"><Check className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'terminé':
        return <Badge variant="secondary"><Check className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'annulé':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleValidation = (registrationId: string, status: string) => {
    if (validateParticipation) {
      validateParticipation({ registrationId, status });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Validation des participants</h2>
      
      {registrations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Aucun participant inscrit pour cette mission.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {registrations.map((registration: any) => (
            <Card key={registration.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {registration.user?.first_name} {registration.user?.last_name}
                  </CardTitle>
                  {getStatusBadge(registration.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleValidation(registration.id, 'confirmé')}
                    disabled={registration.status === 'confirmé'}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Confirmer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleValidation(registration.id, 'terminé')}
                    disabled={registration.status === 'terminé'}
                  >
                    Marquer terminé
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleValidation(registration.id, 'annulé')}
                    disabled={registration.status === 'annulé'}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantValidation;
