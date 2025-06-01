
import React from "react";
import { useParams } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationReviews } from "@/hooks/useMissionReviews";
import { useFollowOrganization } from "@/hooks/useFollowOrganization";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Globe, Users, Calendar, UserPlus, UserMinus, Star, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import ReviewCard from "@/components/reviews/ReviewCard";

const PublicOrganizationProfile = () => {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const { organization, missions, isLoading } = useOrganization(organizationId);
  const { data: reviews, isLoading: isLoadingReviews } = useOrganizationReviews(organizationId);
  const { isFollowing, follow, unfollow, isFollowLoading, isUnfollowLoading } = useFollowOrganization(
    user?.id,
    organizationId
  );

  if (isLoading) {
    return (
      <div className="container py-4 sm:py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container py-4 sm:py-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold mb-2">Organisation non trouvée</h2>
          <p className="text-muted-foreground">Cette organisation n'existe pas ou a été supprimée.</p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="container py-4 sm:py-8 space-y-6">
      {/* Bouton retour */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
      </Button>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 self-center md:self-start">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                <AvatarImage src={organization.logo_url || ''} />
                <AvatarFallback>
                  <Users className="w-10 h-10 sm:w-12 sm:h-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold break-words">{organization.organization_name}</h1>
                {user && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading || isUnfollowLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className="flex items-center gap-2 w-full sm:w-auto"
                    size="sm"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span className="hidden sm:inline">Ne plus suivre</span>
                        <span className="sm:hidden">Suivi</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Suivre</span>
                        <span className="sm:hidden">Suivre</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                {organization.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{organization.address}</span>
                  </div>
                )}
                {organization.website_url && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <a 
                      href={organization.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary truncate"
                    >
                      Site web
                    </a>
                  </div>
                )}
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{averageRating.toFixed(1)}/5 ({reviews?.length} avis)</span>
                  </div>
                )}
              </div>

              {organization.description && (
                <p className="text-muted-foreground text-sm sm:text-base">{organization.description}</p>
              )}

              {organization.organization_sectors && (
                <div className="flex justify-center md:justify-start">
                  <Badge variant="secondary">{organization.organization_sectors.name}</Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour organiser le contenu */}
      <Tabs defaultValue="missions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="missions" className="text-xs sm:text-sm">
            Missions ({missions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm">
            Avis ({reviews?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Missions de l'organisation</CardTitle>
            </CardHeader>
            <CardContent>
              {!missions || missions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune mission publiée pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missions.map((mission) => (
                    <Card key={mission.id} className="border rounded-lg hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/missions/${mission.id}`}
                              className="font-medium text-base sm:text-lg hover:text-primary transition-colors block"
                            >
                              <h3 className="break-words">{mission.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {mission.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">
                                  {format(new Date(mission.start_date), 'PPP', { locale: fr })}
                                </span>
                              </div>
                              {mission.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">{mission.location}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge variant="outline" className="text-xs">{mission.status}</Badge>
                              <Badge variant="secondary" className="text-xs">{mission.format}</Badge>
                              {mission.available_spots && (
                                <Badge variant="outline" className="text-xs">
                                  {mission.participants_count || 0}/{mission.available_spots} places
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Link to={`/missions/${mission.id}`}>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                Voir les détails
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                Avis des bénévoles
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{averageRating.toFixed(1)}/5</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReviews ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chargement des avis...</p>
                </div>
              ) : !reviews || reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">Aucun avis pour cette organisation</p>
                  <p className="text-sm text-muted-foreground">
                    Les avis apparaîtront ici une fois que les bénévoles auront terminé des missions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showMissionTitle={true}
                      canRespond={user?.id === organizationId}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicOrganizationProfile;
