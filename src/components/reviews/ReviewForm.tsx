
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { useCreateReview } from '@/hooks/useMissionReviews';

interface ReviewFormProps {
  missionId: string;
  missionTitle: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ missionId, missionTitle, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      await createReview.mutateAsync({
        mission_id: missionId,
        rating,
        comment: comment.trim() || undefined,
        is_anonymous: isAnonymous
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setIsAnonymous(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderInteractiveStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isActive = starNumber <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starNumber)}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-8 h-8 ${
              isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Donner votre avis</CardTitle>
        <p className="text-sm text-gray-600">Mission : {missionTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Note (obligatoire)
            </label>
            <div className="flex gap-1">
              {renderInteractiveStars()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Note : {rating}/5 étoiles
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Commentaire (optionnel)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec cette mission..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            />
            <label htmlFor="anonymous" className="text-sm">
              Publier cet avis de manière anonyme
            </label>
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || createReview.isPending}
            className="w-full"
          >
            {createReview.isPending ? 'Publication...' : 'Publier l\'avis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
