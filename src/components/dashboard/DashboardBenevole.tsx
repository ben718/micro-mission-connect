import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Award, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardBenevole = () => {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Bienvenue */}
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold">
            Bienvenue, {profile.first_name} !
          </h1>
          <p className="text-muted-foreground">
            Voici votre tableau de bord bénévole. Retrouvez ici vos missions, badges et statistiques.
          </p>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <Users className="w-8 h-8 text-primary" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Missions participées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <Calendar className="w-8 h-8 text-primary" />
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Heures de bénévolat</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <Award className="w-8 h-8 text-primary" />
            <div className="text-2xl font-bold">{profile.user_badges?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Badges obtenus</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
            <Link to="/missions">
              <Users className="w-6 h-6" />
              <span>Trouver une mission</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Link to="/badges">
              <Award className="w-6 h-6" />
              <span>Voir mes badges</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Link to="/profile/volunteer">
              <Eye className="w-6 h-6" />
              <span>Mon profil</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Missions à venir */}
      <Card>
        <CardHeader>
          <CardTitle>Mes missions à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore de missions à venir.
            </p>
            <Button asChild>
              <Link to="/missions">
                <Plus className="mr-2 h-4 w-4" /> Trouver une mission
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Badges récents</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/badges">Voir tous</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {profile.user_badges && profile.user_badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.user_badges.slice(0, 3).map((badge: any) => (
                <Badge key={badge.id} variant="secondary" className="px-3 py-1">
                  <Award className="w-3 h-3 mr-1" />
                  {badge.badge?.name || "Badge"}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Vous n'avez pas encore obtenu de badges.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Missions recommandées */}
      <Card>
        <CardHeader>
          <CardTitle>Missions recommandées pour vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nous préparons des recommandations basées sur votre profil.
            </p>
            <Button asChild>
              <Link to="/missions">
                <Eye className="mr-2 h-4 w-4" /> Explorer les missions
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardBenevole;
