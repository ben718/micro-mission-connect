import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  Award, 
  Clock, 
  Heart,
  Search,
  MessageSquare,
  Settings
} from "lucide-react";

const DashboardVolunteer = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {profile?.full_name}
        </h1>
        <p className="text-gray-600">
          Découvrez des missions qui correspondent à vos compétences
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Trouver une mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/missions">Explorer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Mes missions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/my-missions">Voir mes missions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/messages">Voir les messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/settings">Configurer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques et aperçus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mes missions */}
        <Card>
          <CardHeader>
            <CardTitle>Mes missions</CardTitle>
            <CardDescription>Vos engagements en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Missions en cours</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Heures réalisées</span>
                </div>
                <span className="font-semibold">24h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Réalisations */}
        <Card>
          <CardHeader>
            <CardTitle>Réalisations</CardTitle>
            <CardDescription>Votre impact social</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span>Badges obtenus</span>
                </div>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-500" />
                  <span>Associations aidées</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardVolunteer; 