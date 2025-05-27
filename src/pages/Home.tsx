import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, 
  Heart, 
  Award, 
  Users,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

const Home = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue sur Micro-Mission
        </h1>
        <p className="text-gray-600">
          Découvrez des missions qui correspondent à vos compétences et faites la différence
        </p>
      </div>

      {/* Recherche rapide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rechercher une mission</CardTitle>
          <CardDescription>Trouvez la mission qui vous correspond</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link to="/missions">
                <Search className="mr-2 h-4 w-4" />
                Explorer les missions
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fonctionnalités principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Faites la différence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Contribuez à des causes qui vous tiennent à cœur et créez un impact positif dans votre communauté.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Développez vos compétences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Acquérez de nouvelles compétences et enrichissez votre expérience professionnelle.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Rejoignez une communauté
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Connectez-vous avec d'autres bénévoles passionnés et partagez vos expériences.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comment ça marche */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-500" />
                1. Explorez
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Parcourez les missions disponibles et trouvez celle qui correspond à vos compétences et disponibilités.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                2. Postulez
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Soumettez votre candidature et attendez la confirmation de l'association.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                3. Engagez-vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Participez à la mission et suivez votre impact sur la plateforme.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appel à l'action */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle>Prêt à faire la différence ?</CardTitle>
          <CardDescription className="text-white/80">
            Rejoignez notre communauté de bénévoles et commencez votre voyage dès aujourd'hui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/missions">
              Découvrir les missions
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home; 