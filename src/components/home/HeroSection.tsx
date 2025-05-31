
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useOptimizedMissions } from "@/hooks/useOptimizedMissions";

const HeroSection = () => {
  // Utiliser les vraies missions de la base de données pour l'exemple
  const { data: missions, isLoading } = useOptimizedMissions({
    limit: 1,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const exampleMission = missions?.[0];

  return (
    <section className="section bg-gradient-to-br from-bleu-50 to-bleu-100 min-h-[70vh] flex items-center">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Offrez votre temps,
              <span className="text-bleu"> même 15 minutes</span> comptent
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Trouvez des missions de bénévolat qui s'adaptent à votre emploi du temps. 
              Aidez les associations locales et développez vos compétences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-bleu hover:bg-bleu-700">
                <Link to="/missions">Découvrir les missions</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth/register">Créer mon compte</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-bleu-200 rounded-lg transform rotate-3 opacity-20"></div>
            {!isLoading && exampleMission ? (
              <Card className="relative bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="mb-2">
                      {exampleMission.mission_type?.name || 'Mission'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                    {exampleMission.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {exampleMission.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {exampleMission.start_date && new Date(exampleMission.start_date).toLocaleDateString('fr-FR')}
                    </div>
                    
                    {exampleMission.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {exampleMission.location}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {exampleMission.participants_count || 0}/{exampleMission.available_spots} participants
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-400">
                      Exemple de mission disponible sur la plateforme
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="relative bg-white shadow-xl">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
