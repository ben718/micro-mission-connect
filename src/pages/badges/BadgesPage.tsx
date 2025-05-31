
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBadges } from "@/hooks/useBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Lock } from "lucide-react";
import { BadgeDetailModal } from "@/components/profile/BadgeDetailModal";

const BadgesPage = () => {
  const { user } = useAuth();
  const { badges, availableBadges, isLoading } = useBadges(user?.id);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement des badges...</p>
        </div>
      </div>
    );
  }

  const userBadgeIds = badges?.map(ub => ub.badge_id) || [];

  const handleBadgeClick = (userBadge: any) => {
    setSelectedBadge(userBadge);
    setIsBadgeModalOpen(true);
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          Mes Badges
        </h1>
        <p className="text-muted-foreground">
          Découvrez vos accomplissements et débloquez de nouveaux badges
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{badges?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Badges obtenus</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold text-muted-foreground">
              {(availableBadges?.length || 0) - (badges?.length || 0)}
            </div>
            <div className="text-sm text-muted-foreground">À débloquer</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">
              {Math.round(((badges?.length || 0) / (availableBadges?.length || 1)) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </CardContent>
        </Card>
      </div>

      {/* Badges obtenus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Badges obtenus ({badges?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges && badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((userBadge) => (
                <div
                  key={userBadge.id}
                  className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-green-50/50 border-green-200"
                  onClick={() => handleBadgeClick(userBadge)}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{userBadge.badge?.name || 'Badge inconnu'}</p>
                    <p className="text-sm text-muted-foreground">
                      Obtenu le {new Date(userBadge.acquisition_date || '').toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    Obtenu
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucun badge obtenu pour le moment. Participez à des missions pour en débloquer !
            </p>
          )}
        </CardContent>
      </Card>

      {/* Badges disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Badges à débloquer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableBadges && availableBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBadges
                .filter(badge => !userBadgeIds.includes(badge.id))
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg opacity-60 bg-gray-50/50"
                  >
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-muted-foreground">{badge.name}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                    <Badge variant="outline" className="border-muted-foreground/20">
                      Verrouillé
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucun badge disponible pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      <BadgeDetailModal
        badge={selectedBadge}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
};

export default BadgesPage;
