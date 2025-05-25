import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Bienvenue sur MicroBénévole
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          La plateforme qui connecte les bénévoles et les associations pour des missions courtes et impactantes.
        </p>
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-bleu text-white">
              <Link to="/auth/register">S'inscrire gratuitement</Link>
            </Button>
            <Button asChild variant="outline" className="text-bleu border-bleu">
              <Link to="/auth/login">Se connecter</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-bleu text-white">
              <Link to="/profile">Voir mon profil</Link>
            </Button>
            <Button asChild variant="outline" className="text-bleu border-bleu">
              <Link to="/missions">Découvrir les missions</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Section Fonctionnalités */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-bleu/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Missions Courtes</h3>
          <p className="text-gray-600">
            Des missions de quelques heures pour s'engager facilement et efficacement.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-bleu/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Mise en Relation</h3>
          <p className="text-gray-600">
            Connectez-vous avec des associations qui correspondent à vos compétences.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-bleu/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Badges & Récompenses</h3>
          <p className="text-gray-600">
            Gagnez des badges et suivez votre progression dans l'engagement associatif.
          </p>
        </div>
      </div>

      {/* Section Comment ça marche */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Créez votre profil</h3>
            <p className="text-gray-600">Inscrivez-vous en tant que bénévole ou association</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Parcourez les missions</h3>
            <p className="text-gray-600">Découvrez les opportunités qui vous correspondent</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Participez</h3>
            <p className="text-gray-600">Inscrivez-vous aux missions qui vous intéressent</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-bleu text-white rounded-full flex items-center justify-center mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2">Engagez-vous</h3>
            <p className="text-gray-600">Participez et faites la différence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 