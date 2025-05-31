
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationProfile } from '@/hooks/useOrganizationProfile';
import { useOrganizationReviews } from '@/hooks/useMissionReviews';
import ReviewCard from '@/components/reviews/ReviewCard';

export default function ReviewsManagement() {
  const { user } = useAuth();
  const { data: organizationProfile } = useOrganizationProfile(user?.id);
  const { data: reviews, isLoading } = useOrganizationReviews(organizationProfile?.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestion des avis</h1>
        <div className="text-center py-8">Chargement des avis...</div>
      </div>
    );
  }

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = reviews?.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) || {};

  const responseRate = reviews?.length 
    ? (reviews.filter(review => review.review_responses && review.review_responses.length > 0).length / reviews.length) * 100
    : 0;

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <h1 className="text-2xl font-bold">Gestion des avis</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRating.toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">
              Sur {reviews?.length || 0} avis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réponse</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Avis avec réponse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Note moyenne
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating] || 0;
              const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Liste des avis */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les avis ({reviews?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showMissionTitle={true}
                  canRespond={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun avis pour le moment</p>
              <p className="text-sm text-gray-400">
                Les avis apparaîtront ici une fois que les bénévoles auront terminé vos missions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
