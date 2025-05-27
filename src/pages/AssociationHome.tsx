import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings,
  PlusCircle,
  Search
} from "lucide-react";

const AssociationHome = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {profile?.organization_name || "Association"}
        </h1>
        <p className="text-gray-600">
          Gérez vos missions et vos bénévoles en toute simplicité
        </p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Nouvelle mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/missions/new">Créer une mission</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Trouver des bénévoles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/volunteers">Rechercher</Link>
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
        {/* Missions actives */}
        <Card>
          <CardHeader>
            <CardTitle>Missions actives</CardTitle>
            <CardDescription>Vos missions en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Missions en cours</span>
                </div>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <span>Bénévoles engagés</span>
                </div>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact social */}
        <Card>
          <CardHeader>
            <CardTitle>Impact social</CardTitle>
            <CardDescription>Mesurez votre impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span>Heures de bénévolat</span>
                </div>
                <span className="font-semibold">156h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <span>Rapports d'impact</span>
                </div>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssociationHome; 