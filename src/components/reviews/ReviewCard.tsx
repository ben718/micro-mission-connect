
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MissionReview, useCreateReviewResponse } from '@/hooks/useMissionReviews';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationProfile } from '@/hooks/useOrganizationProfile';

interface ReviewCardProps {
  review: MissionReview;
  showMissionTitle?: boolean;
  canRespond?: boolean;
}

export default function ReviewCard({ review, showMissionTitle = false, canRespond = false }: ReviewCardProps) {
  const { user } = useAuth();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const createResponse = useCreateReviewResponse();

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !organizationProfile) return;

    try {
      await createResponse.mutateAsync({
        review_id: review.id,
        organization_id: organizationProfile.id,
        response_text: responseText.trim()
      });
      setResponseText('');
      setShowResponseForm(false);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const displayName = review.is_anonymous 
    ? 'Bénévole anonyme'
    : `${review.profiles?.first_name} ${review.profiles?.last_name}`;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {!review.is_anonymous && review.profiles?.profile_picture_url && (
                <AvatarImage src={review.profiles.profile_picture_url} />
              )}
              <AvatarFallback>
                {review.is_anonymous ? 'A' : displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayName}</p>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">
                  {format(new Date(review.created_at), 'dd MMM yyyy', { locale: fr })}
                </span>
              </div>
              {showMissionTitle && review.missions?.title && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {review.missions.title}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {review.comment && (
          <p className="text-gray-700 mb-4">{review.comment}</p>
        )}

        {/* Réponses existantes */}
        {review.review_responses && review.review_responses.length > 0 && (
          <div className="space-y-3">
            {review.review_responses.map((response) => (
              <div key={response.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Reply className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">
                    {response.organization_profiles?.organization_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(response.created_at), 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{response.response_text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire de réponse */}
        {canRespond && !review.review_responses?.length && (
          <div className="mt-4">
            {!showResponseForm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResponseForm(true)}
                className="flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                Répondre
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Rédigez votre réponse..."
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim() || createResponse.isPending}
                  >
                    {createResponse.isPending ? 'Envoi...' : 'Envoyer'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowResponseForm(false);
                      setResponseText('');
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
