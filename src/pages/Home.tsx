
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            Bienvenue sur MicroBénévole
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8 max-w-2xl mx-auto px-4">
            La plateforme qui connecte les bénévoles et les associations pour des missions courtes et impactantes.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
              <Button asChild className="bg-bleu text-white w-full sm:w-auto">
                <Link to="/auth/register">S'inscrire gratuitement</Link>
              </Button>
              <Button asChild variant="outline" className="text-bleu border-bleu w-full sm:w-auto">
                <Link to="/auth/login">Se connecter</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
              <Button asChild className="bg-bleu text-white w-full sm:w-auto">
                <Link to="/profile">Voir mon profil</Link>
              </Button>
              <Button asChild variant="outline" className="text-bleu border-bleu w-full sm:w-auto">
                <Link to="/missions">Découvrir les missions</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Section Fonctionnalités */}
        <div className="mt-12 lg:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4">
          <div className="text-center p-4 lg:p-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-bleu/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <span className="text-xl lg:text-2xl">🎯</span>
            </div>
            <h3 className="text-lg lg:text-xl font-semibold mb-2">Missions Courtes</h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Des missions de quelques heures pour s'engager facilement et efficacement.
            </p>
          </div>
          <div className="text-center p-4 lg:p-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-bleu/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <span className="text-xl lg:text-2xl">🤝</span>
            </div>
            <h3 className="text-lg lg:text-xl font-semibold mb-2">Mise en Relation</h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Connectez-vous avec des associations qui correspondent à vos compétences.
            </p>
          </div>
          <div className="text-center p-4 lg:p-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-bleu/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <span className="text-xl lg:text-2xl">🏆</span>
            </div>
            <h3 className="text-lg lg:text-xl font-semibold mb-2">Badges & Récompenses</h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Gagnez des badges et suivez votre progression dans l'engagement associatif.
            </p>
          </div>
        </div>

        {/* Section Comment ça marche */}
        <div className="mt-12 lg:mt-20 px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 text-sm lg:text-base font-semibold">
                1
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Créez votre profil</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Inscrivez-vous en tant que bénévole ou association</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 text-sm lg:text-base font-semibold">
                2
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Parcourez les missions</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Découvrez les opportunités qui vous correspondent</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 text-sm lg:text-base font-semibold">
                3
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Participez</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Inscrivez-vous aux missions qui vous intéressent</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 text-sm lg:text-base font-semibold">
                4
              </div>
              <h3 className="font-semibold mb-2 text-sm lg:text-base">Engagez-vous</h3>
              <p className="text-gray-600 text-xs lg:text-sm">Participez et faites la différence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
