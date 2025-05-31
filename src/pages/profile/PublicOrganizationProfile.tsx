
import React from "react";
import { useParams } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useFollowOrganization } from "@/hooks/useFollowOrganization";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Users, Calendar, UserPlus, UserMinus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

const PublicOrganizationProfile = () => {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const { organization, missions, isLoading } = useOrganization(organizationId);
  const { isFollowing, follow, unfollow, isFollowLoading, isUnfollowLoading } = useFollowOrganization(
    user?.id,
    organizationId
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Organisation non trouvée</h2>
          <p className="text-muted-foreground">Cette organisation n'existe pas ou a été supprimée.</p>
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

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24">
                <AvatarImage src={organization.logo_url || ''} />
                <AvatarFallback>
                  <Users className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{organization.organization_name}</h1>
                {user && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading || isUnfollowLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className="flex items-center gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Ne plus suivre
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Suivre
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {organization.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{organization.address}</span>
                  </div>
                )}
                {organization.website_url && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={organization.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      Site web
                    </a>
                  </div>
                )}
              </div>

              {organization.description && (
                <p className="text-muted-foreground">{organization.description}</p>
              )}

              {organization.organization_sectors && (
                <Badge variant="secondary">{organization.organization_sectors.name}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missions */}
      <Card>
        <CardHeader>
          <CardTitle>Missions de l'organisation</CardTitle>
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link 
                          to={`/missions/${mission.id}`}
                          className="font-medium text-lg hover:text-primary transition-colors"
                        >
                          <h3>{mission.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {mission.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(mission.start_date), 'PPP', { locale: fr })}
                            </span>
                          </div>
                          {mission.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{mission.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Badge variant="outline">{mission.status}</Badge>
                          <Badge variant="secondary">{mission.format}</Badge>
                          {mission.available_spots && (
                            <Badge variant="outline">
                              {mission.participants_count || 0}/{mission.available_spots} places
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link to={`/missions/${mission.id}`}>
                          <Button variant="outline" size="sm">
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
    </div>
  );
};

export default PublicOrganizationProfile;
